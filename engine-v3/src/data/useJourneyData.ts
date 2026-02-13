// Supabase journey data integration scaffold.
// In production, this fetches real patient journey progress from Supabase.
// Currently returns demo data for development.

import { useState, useEffect, useMemo } from 'react';
import { NodeState, Biome, Season, QUARTER_BIOMES } from '../game/contracts';
import { getPathConfig, PathConfig } from './journey-paths';

export interface JourneyProgress {
  journeyId: string;
  patientId: string;
  weekCount: number;
  currentQuarter: 1 | 2 | 3 | 4;
  currentWeek: number;
  currentDay: number;
  nodeStates: Record<string, NodeState>;
  startDate: string;
}

export interface UseJourneyDataResult {
  loading: boolean;
  error: string | null;
  progress: JourneyProgress | null;
  pathConfig: PathConfig;
  biome: Biome;
  season: Season;
  updateNodeState: (nodeId: string, state: NodeState) => void;
  refresh: () => void;
}

function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

function buildDemoStates(pathConfig: PathConfig): Record<string, NodeState> {
  const states: Record<string, NodeState> = {};

  pathConfig.monthlyPath.forEach((node, i) => {
    if (i === 0) states[node.id] = 'completed';
    else if (i === 1) states[node.id] = 'in_progress';
    else if (i === 2) states[node.id] = 'unlocked';
    else states[node.id] = 'locked';
  });

  Object.entries(pathConfig.weeklyPaths).forEach(([weekId, days]) => {
    days.forEach((day, i) => {
      if (weekId === 'w1') {
        states[day.id] = 'completed';
      } else if (weekId === 'w2') {
        if (i < 3) states[day.id] = 'completed';
        else if (i === 3) states[day.id] = 'in_progress';
        else if (i === 4) states[day.id] = 'unlocked';
        else states[day.id] = 'locked';
      } else {
        states[day.id] = 'locked';
      }
    });
  });

  pathConfig.dailyLayout.forEach((task) => {
    states[`w2-d4-${task.id}`] = 'unlocked';
    states[`w2-d3-${task.id}`] = 'completed';
  });

  return states;
}

export function useJourneyData(journeyId: string = 'demo'): UseJourneyDataResult {
  const pathConfig = useMemo(() => getPathConfig(12), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>({});

  const progress = useMemo((): JourneyProgress => ({
    journeyId,
    patientId: 'demo-patient',
    weekCount: 12,
    currentQuarter: 1,
    currentWeek: 2,
    currentDay: 4,
    nodeStates,
    startDate: new Date().toISOString(),
  }), [journeyId, nodeStates]);

  useEffect(() => {
    // Simulate async load. In production: fetch from Supabase.
    const timer = setTimeout(() => {
      setNodeStates(buildDemoStates(pathConfig));
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [pathConfig]);

  const updateNodeState = (nodeId: string, state: NodeState) => {
    setNodeStates(prev => ({ ...prev, [nodeId]: state }));
    // In production: write to Supabase
    // supabase.from('journey_progress').upsert({ node_id: nodeId, state });
  };

  const refresh = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setNodeStates(buildDemoStates(pathConfig));
      setLoading(false);
    }, 100);
  };

  return {
    loading,
    error,
    progress,
    pathConfig,
    biome: QUARTER_BIOMES[progress.currentQuarter],
    season: getCurrentSeason(),
    updateNodeState,
    refresh,
  };
}
