// Asset loader scaffold for sprite-based rendering upgrade.
//
// NOT CURRENTLY WIRED. All rendering uses procedural Graphics API.
// When switching to sprite-based rendering:
//   1. Use Expo's Asset.fromModule(require('../../assets/...')) for native
//   2. Register with PIXI.Assets.add() before loading
//   3. Call preloadAssets() during scene init in PixiCanvas
//
// On React Native, PIXI.Assets.load(path) won't resolve filesystem paths.
// Assets must be bundled via require() and resolved through Expo's asset system.

import * as PIXI from 'pixi.js';

const loadedTextures = new Map<string, PIXI.Texture>();

function getPlaceholder(): PIXI.Texture {
  return PIXI.Texture.WHITE;
}

export async function loadTexture(path: string): Promise<PIXI.Texture> {
  if (loadedTextures.has(path)) {
    return loadedTextures.get(path)!;
  }

  try {
    const texture = await PIXI.Assets.load(path);
    loadedTextures.set(path, texture);
    return texture;
  } catch {
    console.warn(`Asset not found: ${path}, using placeholder`);
    return getPlaceholder();
  }
}

export async function preloadAssets(paths: string[]): Promise<Map<string, PIXI.Texture>> {
  const results = new Map<string, PIXI.Texture>();
  const promises = paths.map(async (path) => {
    const texture = await loadTexture(path);
    results.set(path, texture);
  });
  await Promise.allSettled(promises);
  return results;
}

export function getLoadedTexture(path: string): PIXI.Texture {
  return loadedTextures.get(path) || getPlaceholder();
}

export function clearTextureCache() {
  loadedTextures.clear();
}
