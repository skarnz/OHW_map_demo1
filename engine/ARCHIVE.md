# Engine V1 (Phaser 3 + Next.js) -- ARCHIVED

> **Status:** Deprecated. Superseded by `engine-v3/` (Expo + Pixi.js v8 + expo-gl).

## What This Was

The original OHW Health Journey Map prototype. Built as an isometric city-builder engine (forked from "Pogicity") adapted for health milestones.

- **Framework:** Next.js 16 + Phaser 3.90
- **Rendering:** Isometric 2:1 tiles (44x22), 48x48 grid
- **State:** React manages grid + UI, Phaser renders + animates
- **Dates:** Jan 22 -- Jan 30, 2026

## What We Built

| File | Purpose |
|------|---------|
| `app/components/game/phaser/MainScene.ts` | Core Phaser scene -- isometric rendering, camera, depth sorting |
| `app/components/game/phaser/PhaserGame.tsx` | React wrapper around Phaser (ref-based communication) |
| `app/components/journey/JourneyMap.tsx` | React component: grid generation, milestone placement, path routing |
| `app/data/milestones.ts` | Complete 4-level node taxonomy (Quarterly/Monthly/Weekly/Daily) |
| `app/page.tsx` | Dev harness: iOS frame toggle, edit mode, sprite generator link |
| `app/api/sprites/route.ts` | API route to list generated sprite JSON from `public/generated/` |
| `app/components/ui/iOSFrame.tsx` | iPhone 15 Pro CSS mockup frame for preview |
| `public/Building/milestones/` | 2 Gemini-generated isometric milestone sprites (Q1, Q3) |
| `public/generated/*.json` | Sprite registry JSONs from the Gemini pipeline |

## What We Learned (carried into V3)

### Architecture
- **React-Phaser bridge is fragile.** `useEffect` + Phaser callbacks caused infinite re-render loops (zoom ref, grid diffing). V3 avoids this by using a simpler React->Pixi contract (`SceneConfig` objects, no bidirectional refs).
- **Grid generation in React, rendering in game engine** is the right split. V3 keeps this pattern.
- **Differential grid updates** (MainScene.ts `updateGrid`) avoided full re-renders. V3 uses `GraphicsPool` for the same goal.

### Data Model
- The **4-level node taxonomy** (Quarterly/Monthly/Weekly/Daily) defined in `milestones.ts` became the foundation for V3's `contracts.ts`. Node categories, states, and the quarterly biome mapping all originated here.
- **JourneyNode/QuarterNode/MonthNode/WeekNode interfaces** were refined into V3's `NodeConfig` and `NodeState`.

### Rendering
- **Isometric math is complex.** 2:1 projection, depth sorting by `(x+y)`, building footprint overlap -- all added cognitive load. V3 switched to orthogonal top-down (simpler coords, no depth tricks).
- **Camera centering on grid position** (`centerOnGridPosition`) was useful UX. V3 implements camera follow via the avatar system instead.

### Asset Pipeline
- **Gemini 3 Pro via OpenRouter works** for sprite generation (~$0.03-0.13/image). The `sprite-generator/` tool and `api/sprites/route.ts` proved the pipeline. V3's `generate-assets.ts` builds on these learnings.
- **Sprite registry pattern** (JSON sidecar per asset) was useful for tracking what was generated. V3 uses a TypeScript manifest instead.

### Dev Tooling
- **iOS frame preview** (`iOSFrame.tsx`) was valuable for mobile-first development. Could be reused in V3's web export.
- **Edit mode toggle** in `page.tsx` helped iterate on milestone positioning.

### Performance Pitfalls (from `.droid/context/learnings.md`)
1. `getAllMilestones()` without memoization -- new array every render
2. `setZoom` in Phaser callback -- React re-render -> Phaser emit -> infinite loop
3. `useState + useEffect` for derived state -- use `useMemo`
4. `console.log` in hot paths -- kills perf in Phaser's update loop

## Unstaged Changes (what the diffs contain)

These modifications were made during the Jan 22-30 development sessions:

- **MainScene.ts:** Added `hasReceivedRealGrid` flag (skip placeholder grass grid), `centerOnGridPosition` method
- **PhaserGame.tsx:** Added `centerOnGridPosition` to ref handle, grid update retry logic (wait for scene ready), `lastGridRef` dedup
- **JourneyMap.tsx:** Added `GeneratedSprite` type, `editMode` prop, debug logging for milestone placement, improved path generation
- **milestones.ts:** Expanded from simple milestone categories to full 4-level taxonomy (564 lines of node definitions)
- **page.tsx:** Added iOS frame toggle, edit mode toggle, sprite generator link
- **globals.css:** Removed 1 line (minor cleanup)
- **next-env.d.ts:** Next.js auto-generated type reference update
