import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Biome, NodeState } from '../../game/contracts';
import { COLORS, SPACING, BIOME_PALETTES } from '../../theme/tokens';

interface QuarterData {
  quarter: 1 | 2 | 3 | 4;
  name: string;
  biome: Biome;
  state: NodeState;
  weeksCompleted: number;
  totalWeeks: number;
}

interface QuarterlyViewProps {
  quarters: QuarterData[];
  onQuarterSelected: (quarter: 1 | 2 | 3 | 4) => void;
}

const BIOME_EMOJI: Record<Biome, string> = {
  wilderness: '🌲',
  town: '🏘️',
  suburbs: '🏡',
  city: '🏙️',
};

const BIOME_DESCRIPTIONS: Record<Biome, string> = {
  wilderness: 'Begin your journey in nature',
  town: 'Building momentum together',
  suburbs: 'Expanding your horizons',
  city: 'Thriving in full wellness',
};

export default function QuarterlyView({
  quarters,
  onQuarterSelected,
}: QuarterlyViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Journey</Text>
        <Text style={styles.headerSubtitle}>Choose a quarter to explore</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {quarters.map((q) => (
          <TouchableOpacity
            key={q.quarter}
            style={[
              styles.quarterCard,
              q.state === 'locked' && styles.quarterCardLocked,
            ]}
            onPress={() => {
              if (q.state !== 'locked') onQuarterSelected(q.quarter);
            }}
            activeOpacity={q.state === 'locked' ? 1 : 0.7}
            role="button"
            accessibilityLabel={`Quarter ${q.quarter}: ${q.name}`}
          >
            <View
              style={[
                styles.biomePreview,
                {
                  backgroundColor: numberToHex(BIOME_PALETTES[q.biome].ground),
                },
                q.state === 'locked' && styles.biomePreviewLocked,
              ]}
            >
              <Text style={styles.biomeEmoji}>{BIOME_EMOJI[q.biome]}</Text>
            </View>

            <View style={styles.quarterInfo}>
              <View style={styles.quarterTitleRow}>
                <Text
                  style={[
                    styles.quarterTitle,
                    q.state === 'locked' && styles.textLocked,
                  ]}
                >
                  Q{q.quarter}: {q.name}
                </Text>
                {q.state === 'locked' && (
                  <Text style={styles.lockIcon}>🔒</Text>
                )}
                {q.state === 'completed' && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </View>

              <Text
                style={[
                  styles.quarterDescription,
                  q.state === 'locked' && styles.textLocked,
                ]}
              >
                {BIOME_DESCRIPTIONS[q.biome]}
              </Text>

              {q.state !== 'locked' && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${q.totalWeeks > 0 ? (q.weeksCompleted / q.totalWeeks) * 100 : 0}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {q.weeksCompleted}/{q.totalWeeks} weeks
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function numberToHex(n: number): string {
  return '#' + n.toString(16).padStart(6, '0');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: SPACING.screenPadding,
    backgroundColor: COLORS.bgWhite,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.screenPadding,
    gap: 16,
    paddingBottom: 100,
  },
  quarterCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: SPACING.cardRadius,
    overflow: 'hidden',
    shadowColor: '#7A3100',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  quarterCardLocked: {
    opacity: 0.6,
  },
  biomePreview: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  biomePreviewLocked: {
    backgroundColor: '#D1D1D1',
  },
  biomeEmoji: {
    fontSize: 36,
  },
  quarterInfo: {
    flex: 1,
    padding: 16,
    gap: 6,
  },
  quarterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quarterTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  lockIcon: {
    fontSize: 14,
  },
  checkIcon: {
    fontSize: 16,
    color: COLORS.nodeCompleted,
    fontWeight: '700',
  },
  quarterDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  textLocked: {
    color: COLORS.textMuted,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.progressTrack,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accentGold,
    borderRadius: 100,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
