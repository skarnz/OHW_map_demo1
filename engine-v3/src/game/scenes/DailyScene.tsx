import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PixiCanvas from '../renderer/PixiCanvas';
import { GameSceneCallbacks, NodeState, Biome, Season } from '../contracts';
import { PathConfig } from '../../data/journey-paths';
import { COLORS } from '../../theme/tokens';

interface DailySceneProps {
  dayId: string;
  dayLabel: string;
  dailyLayout: PathConfig['dailyLayout'];
  nodeStates: Record<string, NodeState>;
  biome: Biome;
  season: Season;
  quarter: 1 | 2 | 3 | 4;
  currentWeek: number;
  onTaskTapped: (taskId: string) => void;
  onBack: () => void;
}

export default function DailyScene({
  dayId,
  dayLabel,
  dailyLayout,
  nodeStates,
  biome,
  season,
  quarter,
  currentWeek,
  onTaskTapped,
  onBack,
}: DailySceneProps) {
  // Prefix task IDs with day ID for uniqueness
  const prefixedNodes = useMemo(() =>
    dailyLayout.map(n => ({
      ...n,
      id: `${dayId}-${n.id}`,
    })),
  [dailyLayout, dayId]);

  const avatarId = useMemo(() => {
    const inProgress = prefixedNodes.find(n => nodeStates[n.id] === 'in_progress');
    if (inProgress) return inProgress.id;
    const unlocked = prefixedNodes.find(n => nodeStates[n.id] === 'unlocked');
    return unlocked?.id || prefixedNodes[0]?.id || '';
  }, [prefixedNodes, nodeStates]);

  const sceneProps = useMemo(() => ({
    sceneType: 'daily' as const,
    journeyId: dayId,
    currentQuarter: quarter,
    currentWeek,
    currentDay: parseInt(dayId.split('-d').pop() || '1', 10),
    pathNodes: prefixedNodes,
    nodeStates,
    biome,
    season,
    avatarPosition: avatarId,
  }), [dayId, quarter, currentWeek, prefixedNodes, nodeStates, biome, season, avatarId]);

  const callbacks: GameSceneCallbacks = useMemo(() => ({
    onNodeTapped: (nodeId) => {
      const state = nodeStates[nodeId];
      if (state === 'unlocked' || state === 'in_progress') {
        onTaskTapped(nodeId);
      }
    },
    onBackPressed: onBack,
    onSceneReady: () => {},
    onAvatarArrived: () => {},
    onCelebrationComplete: () => {},
  }), [nodeStates, onTaskTapped, onBack]);

  const completed = prefixedNodes.filter(n => nodeStates[n.id] === 'completed').length;
  const total = prefixedNodes.length;
  const progressPct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>{'\u2190'} Weekly</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{dayLabel}</Text>
          <Text style={styles.subtitle}>{completed}/{total} tasks</Text>
        </View>
        <View style={styles.spacer} />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <PixiCanvas sceneProps={sceneProps} callbacks={callbacks} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: COLORS.bgWhite,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 80,
  },
  backText: {
    fontSize: 16,
    color: COLORS.accentBlue,
    fontWeight: '500',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  spacer: {
    minWidth: 80,
  },
  progressTrack: {
    height: 3,
    backgroundColor: COLORS.progressTrack,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accentGold,
  },
});
