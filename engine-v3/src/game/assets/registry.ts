/**
 * Asset registry: static require() calls for Metro bundler.
 * Metro requires all require() calls to be statically analyzable,
 * so we can't build these dynamically from the manifest.
 */
import { Platform } from 'react-native';

type AssetSource = number; // require() returns a number in React Native (asset ID)

// All static requires must be listed explicitly for Metro
const ASSET_SOURCES: Record<string, AssetSource> = {
  // Node icons
  'nodes/week-locked.png': require('../../assets/nodes/week-locked.png'),
  'nodes/week-unlocked.png': require('../../assets/nodes/week-unlocked.png'),
  'nodes/week-completed.png': require('../../assets/nodes/week-completed.png'),
  'nodes/day-locked.png': require('../../assets/nodes/day-locked.png'),
  'nodes/day-unlocked.png': require('../../assets/nodes/day-unlocked.png'),
  'nodes/day-completed.png': require('../../assets/nodes/day-completed.png'),
  'nodes/task-medication.png': require('../../assets/nodes/task-medication.png'),
  'nodes/task-nutrition.png': require('../../assets/nodes/task-nutrition.png'),
  'nodes/task-movement.png': require('../../assets/nodes/task-movement.png'),
  'nodes/task-wellness.png': require('../../assets/nodes/task-wellness.png'),
  'nodes/task-checkin.png': require('../../assets/nodes/task-checkin.png'),

  // Tiles - wilderness
  'tiles/wilderness/grass.png': require('../../assets/tiles/wilderness/grass.png'),
  'tiles/wilderness/dirt-path.png': require('../../assets/tiles/wilderness/dirt-path.png'),
  'tiles/wilderness/water.png': require('../../assets/tiles/wilderness/water.png'),

  // Tiles - town
  'tiles/town/grass.png': require('../../assets/tiles/town/grass.png'),
  'tiles/town/cobble.png': require('../../assets/tiles/town/cobble.png'),

  // Tiles - suburbs
  'tiles/suburbs/lawn.png': require('../../assets/tiles/suburbs/lawn.png'),
  'tiles/suburbs/sidewalk.png': require('../../assets/tiles/suburbs/sidewalk.png'),

  // Tiles - city
  'tiles/city/asphalt.png': require('../../assets/tiles/city/asphalt.png'),
  'tiles/city/concrete.png': require('../../assets/tiles/city/concrete.png'),

  // Avatar - idle
  'avatar/idle/frame1.png': require('../../assets/avatar/idle/frame1.png'),
  'avatar/idle/frame2.png': require('../../assets/avatar/idle/frame2.png'),
  'avatar/idle/frame3.png': require('../../assets/avatar/idle/frame3.png'),
  'avatar/idle/frame4.png': require('../../assets/avatar/idle/frame4.png'),

  // Avatar - walk
  'avatar/walk/frame1.png': require('../../assets/avatar/walk/frame1.png'),
  'avatar/walk/frame2.png': require('../../assets/avatar/walk/frame2.png'),
  'avatar/walk/frame3.png': require('../../assets/avatar/walk/frame3.png'),
  'avatar/walk/frame4.png': require('../../assets/avatar/walk/frame4.png'),
  'avatar/walk/frame5.png': require('../../assets/avatar/walk/frame5.png'),
  'avatar/walk/frame6.png': require('../../assets/avatar/walk/frame6.png'),

  // Avatar - celebrate
  'avatar/celebrate/frame1.png': require('../../assets/avatar/celebrate/frame1.png'),
  'avatar/celebrate/frame2.png': require('../../assets/avatar/celebrate/frame2.png'),
  'avatar/celebrate/frame3.png': require('../../assets/avatar/celebrate/frame3.png'),
  'avatar/celebrate/frame4.png': require('../../assets/avatar/celebrate/frame4.png'),
  'avatar/celebrate/frame5.png': require('../../assets/avatar/celebrate/frame5.png'),
  'avatar/celebrate/frame6.png': require('../../assets/avatar/celebrate/frame6.png'),

  // UI
  'ui/placeholder.png': require('../../assets/ui/placeholder.png'),
};

export function getAssetSource(key: string): AssetSource | null {
  return ASSET_SOURCES[key] ?? null;
}

export function getAllAssetKeys(): string[] {
  return Object.keys(ASSET_SOURCES);
}

/**
 * Resolve an Expo asset source to a URI that PIXI.Assets can load.
 * On web, require() returns a string URI directly.
 * On native, we need Asset.fromModule() to get the local URI.
 */
export async function resolveAssetUri(key: string): Promise<string | null> {
  const source = getAssetSource(key);
  if (source == null) return null;

  if (Platform.OS === 'web') {
    // On web, require() returns a string path
    return source as unknown as string;
  }

  // On native, use Expo Asset to resolve the bundled file to a local URI
  try {
    const { Asset } = await import('expo-asset');
    const [asset] = await Asset.loadAsync(source);
    return asset.localUri ?? asset.uri;
  } catch {
    return null;
  }
}
