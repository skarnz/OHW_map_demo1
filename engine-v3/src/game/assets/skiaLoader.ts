/**
 * Skia-compatible asset loader.
 * Resolves bundled assets to URIs for use with @shopify/react-native-skia's
 * useImage hook and Skia.Image.MakeImageFromEncoded.
 *
 * Replaces the Pixi-specific loader.ts for the Skia renderer pipeline.
 *
 * NOTE: This module dynamically imports registry.ts (which depends on
 * react-native) to avoid breaking Node.js smoke tests. Pure key-mapping
 * functions (getNodeIconKey, getAvatarFrameKey) are safe to import anywhere.
 */
import { getRequiredAssets } from './manifest';

const resolvedUris = new Map<string, string>();
let preloaded = false;

/**
 * Resolve a single asset key to a URI string.
 * On web, require() returns a string directly.
 * On native, uses expo-asset to get a local file URI.
 */
export async function resolveAssetUri(key: string): Promise<string | null> {
  if (resolvedUris.has(key)) return resolvedUris.get(key)!;

  const { getAssetSource } = await import('./registry');
  const { Platform } = await import('react-native');

  const source = getAssetSource(key);
  if (source == null) return null;

  if (Platform.OS === 'web') {
    const uri = source as unknown as string;
    resolvedUris.set(key, uri);
    return uri;
  }

  try {
    const { Asset } = await import('expo-asset');
    const [asset] = await Asset.loadAsync(source);
    const uri = asset.localUri ?? asset.uri;
    if (uri) resolvedUris.set(key, uri);
    return uri;
  } catch {
    return null;
  }
}

/**
 * Preload all image assets, resolving URIs for later use.
 * Returns the set of keys that resolved successfully.
 */
export async function preloadSkiaAssets(): Promise<Set<string>> {
  const loaded = new Set<string>();
  const { getAllAssetKeys } = await import('./registry');
  const keys = getAllAssetKeys();

  for (const key of keys) {
    if (!key.endsWith('.png')) continue;
    const uri = await resolveAssetUri(key);
    if (uri) loaded.add(key);
  }

  preloaded = true;
  return loaded;
}

export function isPreloaded(): boolean {
  return preloaded;
}

/**
 * Get the resolved URI for a previously loaded asset.
 * Returns null if not yet resolved.
 */
export function getResolvedUri(key: string): string | null {
  return resolvedUris.get(key) ?? null;
}

/**
 * Get node icon asset key for a given node type, state, and optional category.
 */
export function getNodeIconKey(
  nodeType: 'week' | 'day',
  state: string,
  category?: string,
): string | null {
  if (category && state !== 'locked' && state !== 'completed' && state !== 'skipped') {
    return `nodes/task-${category}.png`;
  }

  const stateMap: Record<string, string> = {
    locked: `nodes/${nodeType}-locked.png`,
    unlocked: `nodes/${nodeType}-unlocked.png`,
    in_progress: `nodes/${nodeType}-unlocked.png`,
    completed: `nodes/${nodeType}-completed.png`,
    skipped: `nodes/${nodeType}-locked.png`,
  };

  return stateMap[state] ?? null;
}

/**
 * Get avatar frame asset key.
 */
export function getAvatarFrameKey(
  animation: 'idle' | 'walk' | 'celebrate',
  frame: number,
): string {
  return `avatar/${animation}/frame${frame}.png`;
}

/**
 * Check which required assets are missing from the resolved cache.
 */
export function getMissingResolvedAssets(): string[] {
  const required = getRequiredAssets();
  return required.filter(key => !resolvedUris.has(key));
}

export function clearCache() {
  resolvedUris.clear();
  preloaded = false;
}
