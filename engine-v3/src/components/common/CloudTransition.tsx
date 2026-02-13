import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface CloudTransitionProps {
  active: boolean;
  onMidpoint?: () => void;
  onComplete?: () => void;
  duration?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HALF_DURATION = 400;

export default function CloudTransition({
  active,
  onMidpoint,
  onComplete,
  duration = HALF_DURATION,
}: CloudTransitionProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1.2);

  useEffect(() => {
    if (active) {
      // Fade in → hold at midpoint → fade out
      opacity.value = withSequence(
        withTiming(1, {
          duration,
          easing: Easing.out(Easing.cubic),
        }),
        withDelay(100, withTiming(0, {
          duration,
          easing: Easing.in(Easing.cubic),
        })),
      );

      scale.value = withSequence(
        withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
        withDelay(100, withTiming(1.1, { duration, easing: Easing.in(Easing.cubic) })),
      );

      // Trigger midpoint callback
      const midTimer = setTimeout(() => {
        onMidpoint?.();
      }, duration);

      // Trigger complete callback
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, duration * 2 + 100);

      return () => {
        clearTimeout(midTimer);
        clearTimeout(completeTimer);
      };
    } else {
      opacity.value = 0;
    }
  }, [active, duration, onMidpoint, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!active) return null;

  return (
    <Animated.View style={[styles.overlay, animatedStyle]} pointerEvents="none">
      {/* Cloud circles */}
      <Animated.View style={[styles.cloud, styles.cloud1]} />
      <Animated.View style={[styles.cloud, styles.cloud2]} />
      <Animated.View style={[styles.cloud, styles.cloud3]} />
      <Animated.View style={[styles.cloud, styles.cloud4]} />
      <Animated.View style={[styles.cloud, styles.cloud5]} />
      <Animated.View style={[styles.cloud, styles.cloud6]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  cloud: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
  },
  cloud1: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.3,
    top: -SCREEN_HEIGHT * 0.05,
    left: -SCREEN_WIDTH * 0.1,
  },
  cloud2: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.25,
    top: SCREEN_HEIGHT * 0.2,
    right: -SCREEN_WIDTH * 0.15,
  },
  cloud3: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.35,
    top: SCREEN_HEIGHT * 0.35,
    left: -SCREEN_WIDTH * 0.2,
  },
  cloud4: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.2,
    top: SCREEN_HEIGHT * 0.6,
    right: -SCREEN_WIDTH * 0.05,
  },
  cloud5: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.28,
    bottom: SCREEN_HEIGHT * 0.05,
    left: SCREEN_WIDTH * 0.1,
  },
  cloud6: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_HEIGHT * 0.2,
    bottom: -SCREEN_HEIGHT * 0.05,
    right: SCREEN_WIDTH * 0.1,
  },
});
