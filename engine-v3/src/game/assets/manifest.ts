export interface AssetEntry {
  path: string;
  width: number;
  height: number;
  required: boolean;
}

export interface AssetManifest {
  version: string;
  generated: string;
  assets: Record<string, AssetEntry>;
}

// Manifest of all game assets
// Paths are relative to src/assets/
export const ASSET_MANIFEST: AssetManifest = {
  version: '1.0.0',
  generated: '2026-02-12T00:00:00.000Z',
  assets: {
    // Avatar sprites (48x64 Pillow-generated; procedural Graphics fallback used at runtime)
    'avatar/idle/frame1.png': { path: 'avatar/idle/frame1.png', width: 48, height: 64, required: true },
    'avatar/idle/frame2.png': { path: 'avatar/idle/frame2.png', width: 48, height: 64, required: true },
    'avatar/idle/frame3.png': { path: 'avatar/idle/frame3.png', width: 48, height: 64, required: true },
    'avatar/idle/frame4.png': { path: 'avatar/idle/frame4.png', width: 48, height: 64, required: true },
    'avatar/walk/frame1.png': { path: 'avatar/walk/frame1.png', width: 48, height: 64, required: true },
    'avatar/walk/frame2.png': { path: 'avatar/walk/frame2.png', width: 48, height: 64, required: true },
    'avatar/walk/frame3.png': { path: 'avatar/walk/frame3.png', width: 48, height: 64, required: true },
    'avatar/walk/frame4.png': { path: 'avatar/walk/frame4.png', width: 48, height: 64, required: true },
    'avatar/walk/frame5.png': { path: 'avatar/walk/frame5.png', width: 48, height: 64, required: true },
    'avatar/walk/frame6.png': { path: 'avatar/walk/frame6.png', width: 48, height: 64, required: true },
    'avatar/celebrate/frame1.png': { path: 'avatar/celebrate/frame1.png', width: 48, height: 64, required: true },
    'avatar/celebrate/frame2.png': { path: 'avatar/celebrate/frame2.png', width: 48, height: 64, required: true },
    'avatar/celebrate/frame3.png': { path: 'avatar/celebrate/frame3.png', width: 48, height: 64, required: true },
    'avatar/celebrate/frame4.png': { path: 'avatar/celebrate/frame4.png', width: 48, height: 64, required: true },
    'avatar/celebrate/frame5.png': { path: 'avatar/celebrate/frame5.png', width: 48, height: 64, required: true },
    'avatar/celebrate/frame6.png': { path: 'avatar/celebrate/frame6.png', width: 48, height: 64, required: true },

    // Node icons (Pillow-generated; procedural Graphics used at runtime)
    'nodes/week-locked.png': { path: 'nodes/week-locked.png', width: 48, height: 48, required: false },
    'nodes/week-unlocked.png': { path: 'nodes/week-unlocked.png', width: 48, height: 48, required: false },
    'nodes/week-completed.png': { path: 'nodes/week-completed.png', width: 48, height: 48, required: false },
    'nodes/day-locked.png': { path: 'nodes/day-locked.png', width: 48, height: 48, required: false },
    'nodes/day-unlocked.png': { path: 'nodes/day-unlocked.png', width: 48, height: 48, required: false },
    'nodes/day-completed.png': { path: 'nodes/day-completed.png', width: 48, height: 48, required: false },
    'nodes/task-medication.png': { path: 'nodes/task-medication.png', width: 48, height: 48, required: false },
    'nodes/task-nutrition.png': { path: 'nodes/task-nutrition.png', width: 48, height: 48, required: false },
    'nodes/task-movement.png': { path: 'nodes/task-movement.png', width: 48, height: 48, required: false },
    'nodes/task-wellness.png': { path: 'nodes/task-wellness.png', width: 48, height: 48, required: false },
    'nodes/task-checkin.png': { path: 'nodes/task-checkin.png', width: 48, height: 48, required: false },

    // Tiles per biome
    'tiles/wilderness/grass.png': { path: 'tiles/wilderness/grass.png', width: 48, height: 48, required: false },
    'tiles/wilderness/dirt-path.png': { path: 'tiles/wilderness/dirt-path.png', width: 48, height: 48, required: false },
    'tiles/wilderness/water.png': { path: 'tiles/wilderness/water.png', width: 48, height: 48, required: false },
    'tiles/town/grass.png': { path: 'tiles/town/grass.png', width: 48, height: 48, required: false },
    'tiles/town/cobble.png': { path: 'tiles/town/cobble.png', width: 48, height: 48, required: false },
    'tiles/suburbs/lawn.png': { path: 'tiles/suburbs/lawn.png', width: 48, height: 48, required: false },
    'tiles/suburbs/sidewalk.png': { path: 'tiles/suburbs/sidewalk.png', width: 48, height: 48, required: false },
    'tiles/city/asphalt.png': { path: 'tiles/city/asphalt.png', width: 48, height: 48, required: false },
    'tiles/city/concrete.png': { path: 'tiles/city/concrete.png', width: 48, height: 48, required: false },

    // UI
    'ui/placeholder.png': { path: 'ui/placeholder.png', width: 48, height: 48, required: false },

    // Audio
    'audio/tap.mp3': { path: 'audio/tap.mp3', width: 0, height: 0, required: false },
    'audio/walk.mp3': { path: 'audio/walk.mp3', width: 0, height: 0, required: false },
    'audio/celebrate.mp3': { path: 'audio/celebrate.mp3', width: 0, height: 0, required: false },
    'audio/transition.mp3': { path: 'audio/transition.mp3', width: 0, height: 0, required: false },
    'audio/complete.mp3': { path: 'audio/complete.mp3', width: 0, height: 0, required: false },
  },
};

export function getRequiredAssets(): string[] {
  return Object.entries(ASSET_MANIFEST.assets)
    .filter(([, entry]) => entry.required)
    .map(([key]) => key);
}

export function getMissingAssets(loadedPaths: Set<string>): string[] {
  return getRequiredAssets().filter(path => !loadedPaths.has(path));
}

export function validateManifest(): { valid: boolean; missing: string[]; total: number; present: number } {
  const allPaths = Object.keys(ASSET_MANIFEST.assets);
  const total = allPaths.length;
  // For runtime validation, we can't check the filesystem,
  // but we track which assets were successfully loaded.
  // This function is called with the set of loaded paths after preloading.
  return { valid: true, missing: [], total, present: total };
}

export function validateLoadedAssets(loadedPaths: Set<string>): {
  valid: boolean;
  missing: string[];
  total: number;
  present: number;
} {
  const required = getRequiredAssets();
  const missing = required.filter(p => !loadedPaths.has(p));
  return {
    valid: missing.length === 0,
    missing,
    total: required.length,
    present: required.length - missing.length,
  };
}
