import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import QuarterlyView from './quarterly/QuarterlyView';
import MonthlyScene from '../game/scenes/MonthlyScene';
import WeeklyScene from '../game/scenes/WeeklyScene';
import DailyScene from '../game/scenes/DailyScene';
import CloudTransition from './common/CloudTransition';
import { NodeState, QUARTER_BIOMES } from '../game/contracts';
import { useJourneyData } from '../data/useJourneyData';
import { COLORS } from '../theme/tokens';

type NavigationLayer = 'quarterly' | 'monthly' | 'weekly' | 'daily';

interface NavigationState {
  layer: NavigationLayer;
  quarter: 1 | 2 | 3 | 4;
  weekId: string;
  dayId: string;
}

const QUARTER_NAMES = ['Foundation', 'Momentum', 'Optimization', 'Sustainability'];

export default function JourneyMapNavigator() {
  const {
    loading,
    error,
    progress,
    pathConfig,
    biome,
    season,
    updateNodeState,
  } = useJourneyData();

  const [nav, setNav] = useState<NavigationState>({
    layer: 'quarterly',
    quarter: 1,
    weekId: 'w1',
    dayId: 'w1-d1',
  });

  const [transitioning, setTransitioning] = useState(false);
  const pendingNavRef = useRef<Partial<NavigationState> | null>(null);

  const nodeStates = progress?.nodeStates ?? {};
  const currentWeek = progress?.currentWeek ?? 1;

  const navigate = useCallback((update: Partial<NavigationState>) => {
    console.log(`[Nav] navigate:`, JSON.stringify(update));
    pendingNavRef.current = update;
    setTransitioning(true);
  }, []);

  const onTransitionMidpoint = useCallback(() => {
    console.log(`[Nav] midpoint, pending:`, JSON.stringify(pendingNavRef.current));
    if (pendingNavRef.current) {
      setNav(prev => ({ ...prev, ...pendingNavRef.current! }));
      pendingNavRef.current = null;
    }
  }, []);

  const onTransitionComplete = useCallback(() => {
    console.log(`[Nav] transition complete`);
    setTransitioning(false);
  }, []);

  // Quarter selection
  const onQuarterSelected = useCallback((quarter: 1 | 2 | 3 | 4) => {
    navigate({ layer: 'monthly', quarter });
  }, [navigate]);

  // Week selection from monthly
  const onWeekSelected = useCallback((weekId: string) => {
    navigate({ layer: 'weekly', weekId });
  }, [navigate]);

  // Day selection from weekly
  const onDaySelected = useCallback((dayId: string) => {
    navigate({ layer: 'daily', dayId });
  }, [navigate]);

  // Task tap from daily → would open native screen
  const onTaskTapped = useCallback((taskId: string) => {
    Alert.alert(
      'Open Native Screen',
      `Task "${taskId}" tapped.\n\nIn production, this opens the corresponding native screen (food logger, medication tracker, etc.)`,
      [
        {
          text: 'Complete Task',
          onPress: () => {
            updateNodeState(taskId, 'completed');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }, [updateNodeState]);

  // Back navigation
  const goBack = useCallback(() => {
    switch (nav.layer) {
      case 'monthly':
        navigate({ layer: 'quarterly' });
        break;
      case 'weekly':
        navigate({ layer: 'monthly' });
        break;
      case 'daily':
        navigate({ layer: 'weekly' });
        break;
    }
  }, [nav.layer, navigate]);

  // Quarter data for the quarterly view
  const quarterData = useMemo(() => {
    return ([1, 2, 3, 4] as const).map(q => {
      let state: NodeState;
      if (q < nav.quarter) state = 'completed';
      else if (q === nav.quarter) state = 'in_progress';
      else state = 'locked';

      return {
        quarter: q,
        name: QUARTER_NAMES[q - 1],
        biome: QUARTER_BIOMES[q],
        state,
        weeksCompleted: q === 1 ? 1 : 0,
        totalWeeks: pathConfig.weekCount,
      };
    });
  }, [pathConfig.weekCount, nav.quarter]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentBlue} />
        <Text style={styles.loadingText}>Loading journey...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Derive biome from the navigated quarter (may differ from progress.currentQuarter)
  const activeBiome = QUARTER_BIOMES[nav.quarter];

  return (
    <View style={styles.container}>
      {nav.layer === 'quarterly' && (
        <QuarterlyView
          quarters={quarterData}
          onQuarterSelected={onQuarterSelected}
        />
      )}

      {nav.layer === 'monthly' && (
        <MonthlyScene
          quarter={nav.quarter}
          pathConfig={pathConfig}
          nodeStates={nodeStates}
          currentWeek={currentWeek}
          biome={activeBiome}
          season={season}
          onWeekSelected={onWeekSelected}
          onBack={goBack}
        />
      )}

      {nav.layer === 'weekly' && (
        <WeeklyScene
          weekId={nav.weekId}
          weekLabel={`Week ${nav.weekId.replace('w', '')}`}
          pathNodes={pathConfig.weeklyPaths[nav.weekId] || []}
          nodeStates={nodeStates}
          currentDay={progress?.currentDay ?? 1}
          biome={activeBiome}
          season={season}
          quarter={nav.quarter}
          onDaySelected={onDaySelected}
          onBack={goBack}
        />
      )}

      {nav.layer === 'daily' && (
        <DailyScene
          dayId={nav.dayId}
          dayLabel={getDayLabel(nav.dayId)}
          dailyLayout={pathConfig.dailyLayout}
          nodeStates={nodeStates}
          biome={activeBiome}
          season={season}
          quarter={nav.quarter}
          currentWeek={parseInt(nav.weekId.replace('w', ''), 10)}
          onTaskTapped={onTaskTapped}
          onBack={goBack}
        />
      )}

      <CloudTransition
        active={transitioning}
        onMidpoint={onTransitionMidpoint}
        onComplete={onTransitionComplete}
      />
    </View>
  );
}

function getDayLabel(dayId: string): string {
  const dayNum = dayId.split('-d').pop();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const idx = parseInt(dayNum || '1', 10) - 1;
  return days[idx] || `Day ${dayNum}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgPrimary,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 15,
    color: '#FF3B30',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
