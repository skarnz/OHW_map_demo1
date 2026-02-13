/**
 * Asset loader: registers bundled PNGs with PIXI.Assets and provides
 * texture access with fallback to PIXI.Texture.WHITE.
 */
import * as PIXI from 'pixi.js';
import { getAllAssetKeys, resolveAssetUri } from './registry';

const loadedTextures = new Map<string, PIXI.Texture>();
let preloaded = false;

/**
 * Preload all registered assets into PIXI.Assets.
 * Call once during scene init (PixiCanvas onContextCreate).
 * Returns the set of keys that loaded successfully.
 */
export async function preloadAssets(): Promise<Set<string>> {
  const loaded = new Set<string>();
  const keys = getAllAssetKeys();

  for (const key of keys) {
    // Skip non-image assets (audio)
    if (!key.endsWith('.png')) continue;

    try {
      const uri = await resolveAssetUri(key);
      if (!uri) continue;

      // Add + load through PIXI.Assets
      if (!PIXI.Assets.resolver.hasKey(key)) {
        PIXI.Assets.add({ alias: key, src: uri });
      }
      const texture = await PIXI.Assets.load<PIXI.Texture>(key);
      if (texture && texture !== PIXI.Texture.EMPTY) {
        loadedTextures.set(key, texture);
        loaded.add(key);
      }
    } catch {
      // Silently skip failed assets -- procedural fallback will be used
    }
  }

  preloaded = true;
  return loaded;
}

export function isPreloaded(): boolean {
  return preloaded;
}

export function getTexture(key: string): PIXI.Texture | null {
  return loadedTextures.get(key) ?? null;
}

export function getTextureOrPlaceholder(key: string): PIXI.Texture {
  return loadedTextures.get(key) ?? PIXI.Texture.WHITE;
}

/**
 * Get node icon texture by state and optional category.
 * Returns null if no texture loaded (caller should use procedural fallback).
 */
export function getNodeTexture(
  nodeType: 'week' | 'day',
  state: string,
  category?: string,
): PIXI.Texture | null {
  // Task-specific icons
  if (category && state !== 'locked' && state !== 'completed' && state !== 'skipped') {
    const taskKey = `nodes/task-${category}.png`;
    const tex = loadedTextures.get(taskKey);
    if (tex) return tex;
  }

  // State-based icons
  const stateMap: Record<string, string> = {
    locked: `nodes/${nodeType}-locked.png`,
    unlocked: `nodes/${nodeType}-unlocked.png`,
    in_progress: `nodes/${nodeType}-unlocked.png`,
    completed: `nodes/${nodeType}-completed.png`,
    skipped: `nodes/${nodeType}-locked.png`,
  };

  const key = stateMap[state];
  if (key) return loadedTextures.get(key) ?? null;
  return null;
}

export function clearTextureCache() {
  loadedTextures.clear();
  preloaded = false;
}
