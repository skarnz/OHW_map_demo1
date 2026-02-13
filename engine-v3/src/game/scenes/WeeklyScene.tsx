import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PixiCanvas from '../renderer/PixiCanvas';
import { GameSceneCallbacks, NodeState, Biome, Season, PathNode } from '../contracts';
import { COLORS } from '../../theme/tokens';

interface WeeklySceneProps {
  weekId: string;
  weekLabel: string;
  pathNodes: PathNode[];
  nodeStates: Record<string, NodeState>;
  currentDay: number;
  biome: Biome;
  season: Season;
  quarter: 1 | 2 | 3 | 4;
  onDaySelected: (dayId: string) => void;
  onBack: () => void;
}

export default function WeeklyScene({
  weekId,
  weekLabel,
  pathNodes,
  nodeStates,
  currentDay,
  biome,
  season,
  quarter,
  onDaySelected,
  onBack,
}: WeeklySceneProps) {
  const avatarId = useMemo(() => {
    // Find the latest non-locked node as avatar position
    const completed = pathNodes.filter(n => {
      const s = nodeStates[n.id];
      return s === 'completed' || s === 'in_progress';
    });
    if (completed.length > 0) return completed[completed.length - 1].id;
    const unlocked = pathNodes.find(n => nodeStates[n.id] === 'unlocked');
    return unlocked?.id || pathNodes[0]?.id || '';
  }, [pathNodes, nodeStates]);

  const sceneProps = useMemo(() => ({
    sceneType: 'weekly' as const,
    journeyId: weekId,
    currentQuarter: quarter,
    currentWeek: parseInt(weekId.replace('w', ''), 10) || 1,
    currentDay,
    pathNodes,
    nodeStates,
    biome,
    season,
    avatarPosition: avatarId,
  }), [weekId, quarter, currentDay, pathNodes, nodeStates, biome, season, avatarId]);

  const callbacks: GameSceneCallbacks = useMemo(() => ({
    onNodeTapped: (nodeId, _nodeType) => {
      if (nodeStates[nodeId] !== 'locked') {
        onDaySelected(nodeId);
      }
    },
    onBackPressed: onBack,
    onSceneReady: () => {},
    onAvatarArrived: () => {},
    onCelebrationComplete: () => {},
  }), [nodeStates, onDaySelected, onBack]);

  const completedDays = pathNodes.filter(n => nodeStates[n.id] === 'completed').length;
  const totalDays = pathNodes.length;
  const progressPct = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>{'\u2190'} Monthly</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{weekLabel}</Text>
          <Text style={styles.subtitle}>{completedDays}/{totalDays} days</Text>
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
