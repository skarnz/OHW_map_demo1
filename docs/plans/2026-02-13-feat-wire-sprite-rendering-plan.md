---
title: "feat: Wire sprite-based rendering via PIXI.Assets"
type: feat
date: 2026-02-13
---

# Wire Sprite-Based Rendering via PIXI.Assets

## Overview

Replace procedural Graphics rendering with sprite-based rendering using the PNG assets on disk. Currently all nodes, props, and avatar are drawn with Graphics API calls. The loader scaffold (`engine-v3/src/game/assets/loader.ts`) exists but is never imported anywhere.

## Problem Statement

The game renders everything procedurally. PNG assets exist on disk (42 files) but aren't loaded or used. For production, sprite-based rendering looks better and is more performant (GPU texture batching vs individual draw calls).

## Proposed Solution

1. Create an asset registry that maps manifest paths to `require()` calls (Expo/Metro needs static requires)
2. Register assets with `PIXI.Assets.add()` during scene init
3. Replace node Graphics with Sprites where available (fallback to Graphics if texture missing)
4. Replace avatar Graphics frames with sprite sheet (when available)

## Technical Considerations

- **React Native constraint:** `PIXI.Assets.load(path)` won't resolve filesystem paths; must use `require()` + Expo Asset system
- **Metro bundler:** All `require()` calls must be static (no dynamic paths)
- **Fallback:** Keep procedural Graphics as fallback when textures aren't loaded
- **Performance:** Sprites batch better than individual Graphics draw calls
- **Depends on:** Gemini art plan (better art = better sprites, but can wire with current placeholders)

## Acceptance Criteria

- [ ] Asset registry maps manifest keys to `require()` sources
- [ ] PIXI.Assets.add() called for all registered assets during init
- [ ] Node rendering uses Sprite when texture available, Graphics fallback
- [ ] Smoke tests still pass
- [ ] No visual regression on web or iOS

## References

- Loader scaffold: `engine-v3/src/game/assets/loader.ts`
- Manifest: `engine-v3/src/game/assets/manifest.ts`
- PixiCanvas: `engine-v3/src/game/renderer/PixiCanvas.tsx` (buildNode, rebuildScene)
- GraphicsPool: `engine-v3/src/game/renderer/GraphicsPool.ts`
