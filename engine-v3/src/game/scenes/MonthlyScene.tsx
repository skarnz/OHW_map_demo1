import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PixiCanvas from '../renderer/PixiCanvas';
import { GameSceneCallbacks, NodeState, Biome, Season } from '../contracts';
import { PathConfig } from '../../data/journey-paths';
import { COLORS } from '../../theme/tokens';

interface MonthlySceneProps {
  quarter: 1 | 2 | 3 | 4;
  pathConfig: PathConfig;
  nodeStates: Record<string, NodeState>;
  currentWeek: number;
  biome: Biome;
  season: Season;
  onWeekSelected: (weekId: string) => void;
  onBack: () => void;
}

const QUARTER_NAMES = ['Foundation', 'Momentum', 'Optimization', 'Sustainability'];

export default function MonthlyScene({
  quarter,
  pathConfig,
  nodeStates,
  currentWeek,
  biome,
  season,
  onWeekSelected,
  onBack,
}: MonthlySceneProps) {
  const sceneProps = useMemo(() => ({
    sceneType: 'monthly' as const,
    journeyId: pathConfig.id,
    currentQuarter: quarter,
    currentWeek,
    currentDay: 0,
    pathNodes: pathConfig.monthlyPath,
    nodeStates,
    biome,
    season,
    avatarPosition: `w${currentWeek}`,
  }), [quarter, pathConfig, nodeStates, currentWeek, biome, season]);

  const callbacks: GameSceneCallbacks = useMemo(() => ({
    onNodeTapped: (nodeId, nodeType) => {
      console.log(`[Monthly] node tapped: ${nodeId} (${nodeType}), state=${nodeStates[nodeId]}`);
      if (nodeType === 'week' && nodeStates[nodeId] !== 'locked') {
        onWeekSelected(nodeId);
      }
    },
    onBackPressed: onBack,
    onSceneReady: () => {},
    onAvatarArrived: () => {},
    onCelebrationComplete: () => {},
  }), [nodeStates, onWeekSelected, onBack]);

  const completedWeeks = pathConfig.monthlyPath.filter(
    n => nodeStates[n.id] === 'completed',
  ).length;
  const totalWeeks = pathConfig.monthlyPath.length;
  const progressPct = totalWeeks > 0 ? (completedWeeks / totalWeeks) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Q{quarter}: {QUARTER_NAMES[quarter - 1]}
          </Text>
          <Text style={styles.subtitle}>
            {completedWeeks}/{totalWeeks} weeks
          </Text>
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
    minWidth: 60,
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
    minWidth: 60,
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
