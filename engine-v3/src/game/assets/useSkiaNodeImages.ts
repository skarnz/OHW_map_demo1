/**
 * Hook to preload node icon images for Skia rendering.
 * Returns a lookup function that maps (nodeType, state, category) -> SkiaImage | null.
 * Falls back to null when images aren't loaded (caller uses procedural rendering).
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { useImage } from '@shopify/react-native-skia';
import type { SkImage } from '@shopify/react-native-skia';
import { getAssetSource } from './registry';
import { Platform } from 'react-native';
import { NodeState, TaskCategory } from '../contracts';

type NodeIconKey = string;

const NODE_ICON_KEYS = [
  'nodes/week-locked.png',
  'nodes/week-unlocked.png',
  'nodes/week-completed.png',
  'nodes/day-locked.png',
  'nodes/day-unlocked.png',
  'nodes/day-completed.png',
  'nodes/task-medication.png',
  'nodes/task-nutrition.png',
  'nodes/task-movement.png',
  'nodes/task-wellness.png',
  'nodes/task-checkin.png',
] as const;

function getNodeIconAssetKey(
  nodeType: 'week' | 'day' | 'task',
  state: NodeState,
  category?: TaskCategory,
): NodeIconKey | null {
  if (category && state !== 'locked' && state !== 'completed' && state !== 'skipped') {
    return `nodes/task-${category}.png`;
  }

  const effectiveType = nodeType === 'task' ? 'day' : nodeType;
  const stateMap: Record<string, string> = {
    locked: `nodes/${effectiveType}-locked.png`,
    unlocked: `nodes/${effectiveType}-unlocked.png`,
    in_progress: `nodes/${effectiveType}-unlocked.png`,
    completed: `nodes/${effectiveType}-completed.png`,
    skipped: `nodes/${effectiveType}-locked.png`,
  };

  return stateMap[state] ?? null;
}

/**
 * Resolve a registry asset source to a URI for Skia's useImage.
 * On web require() returns a string. On native uses expo-asset.
 */
async function resolveToUri(key: string): Promise<string | null> {
  const source = getAssetSource(key);
  if (source == null) return null;

  if (Platform.OS === 'web') {
    return source as unknown as string;
  }

  try {
    const { Asset } = await import('expo-asset');
    const [asset] = await Asset.loadAsync(source);
    return asset.localUri ?? asset.uri;
  } catch {
    return null;
  }
}

/**
 * Preloads all node icon images and returns a lookup function.
 *
 * Usage in SkiaCanvas:
 *   const getNodeImage = useNodeIconImages();
 *   const img = getNodeImage('week', 'completed');
 *   if (img) { <Image image={img} ... /> } else { <Circle ... /> }
 */
export function useNodeIconImages(): (
  nodeType: 'week' | 'day' | 'task',
  state: NodeState,
  category?: TaskCategory,
) => SkImage | null {
  const [uriMap, setUriMap] = useState<Record<string, string>>({});
  const imageCache = useRef<Map<string, SkImage | null>>(new Map());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved: Record<string, string> = {};
      for (const key of NODE_ICON_KEYS) {
        const uri = await resolveToUri(key);
        if (uri && !cancelled) resolved[key] = uri;
      }
      if (!cancelled) setUriMap(resolved);
    })();
    return () => { cancelled = true; };
  }, []);

  const getImage = useCallback(
    (nodeType: 'week' | 'day' | 'task', state: NodeState, category?: TaskCategory) => {
      const key = getNodeIconAssetKey(nodeType, state, category);
      if (!key || !uriMap[key]) return null;
      return imageCache.current.get(key) ?? null;
    },
    [uriMap],
  );

  return getImage;
}

export { getNodeIconAssetKey, NODE_ICON_KEYS };
