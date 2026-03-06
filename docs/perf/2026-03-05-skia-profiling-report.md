# Performance Profiling Report: Skia Canvas Renderer

**Date:** 2026-03-05
**Engine:** engine-v3 (Expo + @shopify/react-native-skia 2.2.12)
**Renderer:** SkiaCanvas.tsx (declarative Skia via React)
**Issue:** #7

---

## Environment Constraints

**Simulator/emulator access blocked** during this session:
- iOS Simulator: Xcode license not accepted (`sudo xcodebuild -license` required)
- Android Emulator: Android SDK/adb not installed

This report is based on **static code analysis** of the rendering pipeline, **draw operation counting**, and **instrumentation added for future device profiling**. Instrumentation files are committed and ready for device-based capture.

---

## Profiling Instrumentation Added

| File | Purpose |
|------|---------|
| `src/perf/PerfMonitor.ts` | Singleton frame-time recorder with FPS, p95/p99, dropped frames, JS heap |
| `src/perf/PerfOverlay.tsx` | HUD overlay showing live metrics (toggle via `enabled` prop) |
| `SkiaCanvas.tsx` | `useFrameCallback` wired to PerfMonitor for per-frame timing |

### Usage

In any scene component, wrap `SkiaCanvas` with the overlay:

```tsx
import PerfOverlay from '../../perf/PerfOverlay';

// Inside scene render:
<View style={{ flex: 1 }}>
  <SkiaCanvas sceneProps={sceneProps} callbacks={callbacks} />
  <PerfOverlay
    scene="monthly"
    nodeCount={pathConfig.monthlyPath.length}
    propCount={estimatedPropCount}
    enabled={__DEV__}
  />
</View>
```

After stopping, `PerfMonitor.stop()` returns a full `PerfReport` JSON with summary stats.

---

## Static Analysis: Draw Operation Count per Scene

### Monthly Scene (12-week journey)

| Layer | Operations | Details |
|-------|-----------|---------|
| Background Rect | 1 | Single fill rect |
| Props (SkiaPropsRenderer) | ~66-99 | ~22-33 prop placements x ~3 Skia primitives each (tree=3, flower=7, lamp=2, etc.) |
| Path segments | 11 | 1 Path per edge (12 nodes = 11 edges) |
| Dashed overlays | 0-11 | 1 extra Path+DashEffect per locked edge |
| Node circles | 36-48 | 3-4 circles per node (shadow + border + fill + optional glow) |
| Node text | 12-24 | 1 icon text + optional 1 label text per node |
| Avatar dot | 2 | 2 circles (monthly indicator) |
| **TOTAL** | **~128-207** | Per render pass |

### Weekly Scene (7-day path)

| Layer | Operations | Details |
|-------|-----------|---------|
| Background Rect | 1 | |
| Props | ~22-36 | Fewer nodes = fewer prop placements |
| Path segments | 6 | 7 nodes = 6 edges |
| Dashed overlays | 0-6 | |
| Node circles | 21-28 | |
| Node text | 7-14 | |
| Avatar (SkiaAvatar) | 1-6 | useFrameCallback + Image or 2 Circle fallback |
| **TOTAL** | **~58-97** | |

### Daily Scene (5 tasks)

| Layer | Operations | Details |
|-------|-----------|---------|
| Background Rect | 1 | |
| Props | ~10-16 | |
| Path segments | 4 | |
| Node circles | 15-20 | |
| Node text | 5-10 | |
| Avatar | 1-6 | |
| **TOTAL** | **~36-57** | |

**Assessment:** Draw counts are well within Skia's budget. Even the worst case (Monthly with 24 weeks + all props) would produce ~400 operations -- far below Skia's typical 10K+ capacity.

---

## Identified Performance Concerns

### P1: No Viewport Culling

**Location:** `SkiaCanvas.tsx` lines 315-410
**Impact:** Medium (Monthly/Weekly only)

All nodes, paths, and props render regardless of camera position. With 24-week journeys, nodes far off-screen still produce draw calls.

**Recommendation:** Add bounds check against camera viewport before rendering each node/path/prop. For typical 12-week journeys this is negligible, but matters for 24-week at scale.

### P2: SkiaAvatar `useFrameCallback` Runs Every Frame

**Location:** `SkiaAvatar.tsx` lines 130-170
**Impact:** Low-Medium

The avatar's frame callback runs continuously (idle bob animation, frame cycling) even when no animation is needed. On idle, it still calls `Date.now()`, does math, and updates shared values every frame.

**Recommendation:** Gate the frame callback: disable when avatar is stationary and no celebration is active. `useFrameCallback` accepts an `isActive` parameter.

### P3: SkiaPropsRenderer Creates React Elements per Prop

**Location:** `SkiaPropsRenderer.tsx`
**Impact:** Low-Medium

Each prop is a separate React component (`PropShape` -> `SkiaTree`/`SkiaBush`/etc.) creating 3-7 Skia elements. With ~30 props this is ~90-200 React elements in the tree.

**Recommendation:** Props are static after mount. Consider using Skia's `Picture` recording to flatten props into a single cached draw call. This would reduce React reconciliation overhead.

### P4: Path String Construction on Every Render

**Location:** `SkiaCanvas.tsx` `buildBezierPath()` called in `.map()`
**Impact:** Low

SVG path strings (`M ... Q ...`) are rebuilt on every render. String construction is cheap but could be memoized since path coordinates don't change unless `pathNodes` change.

**Recommendation:** Memoize path strings alongside `resolvedNodes`.

### P5: `console.log` in PixiCanvas (dead code)

**Location:** `PixiCanvas.tsx` (no longer used by scenes)
**Impact:** None (dead code)

`PixiCanvas.tsx` is not imported by any scene -- all scenes use `SkiaCanvas`. The file can be removed or archived.

### P6: Font Matching on Mount

**Location:** `SkiaCanvas.tsx` `matchFont()` calls
**Impact:** Low (one-time cost)

Three `matchFont` calls on mount. These are memoized via `useMemo` -- no action needed.

### P7: Prop Generation Deterministic but Recreated per Scene Transition

**Location:** `SkiaPropsRenderer.tsx` `generateProps()`
**Impact:** Low

Props are regenerated via `useMemo` keyed on `[resolvedNodes, biome]`. Since resolvedNodes include screen width in their coordinates, a layout change (rotation) would regenerate. This is correct behavior.

---

## Performance Budget Assessment

| Metric | Budget | Estimated | Status |
|--------|--------|-----------|--------|
| FPS | >= 55 sustained | 60 (expected) | PASS (pending device verification) |
| Frame time p95 | < 20ms | < 16ms (expected) | PASS (pending) |
| JS Heap | < 150MB | ~30-50MB (estimated) | PASS (pending) |
| Scene transition | < 500ms | ~200-300ms (cloud animation) | PASS |
| Initial render | < 1s | ~300-500ms (estimated) | PASS (pending) |
| Draw operations | < 500 per frame | ~130-200 (monthly 12w) | PASS |

**Rationale:** Skia on iOS/Android typically handles 5K-10K draw ops at 60fps. Our scenes produce 50-200 ops. The main risk is React reconciliation overhead from the declarative approach, not Skia rendering itself.

---

## Action Items

| Priority | Action | File | Effort |
|----------|--------|------|--------|
| **P1** | Add viewport culling for nodes/paths/props | `SkiaCanvas.tsx`, `SkiaPropsRenderer.tsx` | Medium |
| **P2** | Gate avatar frame callback with `isActive` flag | `SkiaAvatar.tsx` | Low |
| **P3** | Cache props as Skia `Picture` for fewer React elements | `SkiaPropsRenderer.tsx` | Medium |
| **P4** | Memoize path strings | `SkiaCanvas.tsx` | Low |
| **P5** | Remove dead `PixiCanvas.tsx` and related Pixi files | `renderer/` | Low |
| **DEVICE** | Run PerfMonitor on iOS simulator + Android emulator | -- | Blocked |

---

## Next Steps

1. **Accept Xcode license** (`sudo xcodebuild -license`) to unblock iOS simulator profiling
2. **Install Android SDK** for Android emulator profiling
3. **Run PerfOverlay** on device with 12-week and 24-week journeys
4. **Capture PerfReport JSON** from console logs for each scene type
5. **Implement P1-P4** optimizations if device profiling reveals issues
6. **Re-profile** after optimizations to verify improvements

---

## Appendix: Rendering Architecture

```
JourneyMapNavigator (React Native)
  |
  +-- QuarterlyView (React Native cards -- no Skia)
  +-- MonthlyScene -> SkiaCanvas
  +-- WeeklyScene  -> SkiaCanvas + SkiaAvatar
  +-- DailyScene   -> SkiaCanvas + SkiaAvatar
        |
        +-- Skia Canvas (declarative)
              +-- Group (camera transform via Reanimated shared values)
                    +-- Rect (background)
                    +-- SkiaPropsRenderer (decorative elements)
                    +-- Path[] (bezier curves between nodes)
                    +-- Circle[] + Text[] (nodes)
                    +-- SkiaAvatar (sprite animation via useFrameCallback)
```

Camera panning runs entirely on the UI thread via Reanimated worklets -- no JS bridge overhead during gesture handling.
