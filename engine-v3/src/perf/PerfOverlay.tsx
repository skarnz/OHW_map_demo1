import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { perfMonitor, PerfSnapshot } from './PerfMonitor';

interface PerfOverlayProps {
  scene: string;
  nodeCount: number;
  propCount: number;
  enabled?: boolean;
}

export default function PerfOverlay({ scene, nodeCount, propCount, enabled = false }: PerfOverlayProps) {
  const [snap, setSnap] = useState<PerfSnapshot | null>(null);

  useEffect(() => {
    if (!enabled) return;

    perfMonitor.start(scene, nodeCount, propCount, (s) => setSnap(s));

    return () => {
      const report = perfMonitor.stop();
      if (report) {
        console.log('[Perf] Final report:', JSON.stringify(report.summary, null, 2));
      }
    };
  }, [enabled, scene, nodeCount, propCount]);

  if (!enabled || !snap) return null;

  const fpsColor = snap.fps >= 55 ? '#34C759' : snap.fps >= 30 ? '#FFB200' : '#FF3B30';

  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={[styles.fps, { color: fpsColor }]}>{snap.fps} FPS</Text>
      <Text style={styles.detail}>{snap.avgFrameTime}ms avg</Text>
      <Text style={styles.detail}>{snap.p95FrameTime}ms p95</Text>
      <Text style={styles.detail}>{snap.droppedFrames} drops</Text>
      {snap.jsHeapMB !== null && (
        <Text style={styles.detail}>{snap.jsHeapMB}MB heap</Text>
      )}
      <Text style={styles.detail}>{nodeCount} nodes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 9999,
  },
  fps: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  detail: {
    fontSize: 10,
    color: '#CCCCCC',
    fontVariant: ['tabular-nums'],
  },
});
