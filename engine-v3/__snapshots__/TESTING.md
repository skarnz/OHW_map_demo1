# Live Testing Screenshots

Sequential log of simulator/device testing during development.
Each session gets a numbered folder. Screenshots are named descriptively.

## Sessions

### 001 - 2026-02-13 - First native iOS test (post Phase 5)

| Screenshot | Scene | Issue |
|-----------|-------|-------|
| `001-monthly-w1-tap.png` | Monthly (Q1) after tapping W1 | Camera not centered, nodes cramped at bottom, huge empty green space above, props tiny/invisible, no path labels visible |
| `002-monthly-after-spacing-fix.png` | Monthly after spacing fix | Nodes slightly bigger (22->28 radius), paths wider (5->7), but still crammed bottom-left. Sine wave not spreading enough. Camera still wrong. |

#### Observations (001)
- Monthly scene renders but camera starts at top-left, showing mostly empty green background
- All 12 week nodes are crammed into the bottom ~30% of the viewport
- Path beziers visible but thin and hard to see
- Node circles render (grey locked, white unlocked, green completed, orange in-progress)
- Blue avatar indicator dot visible near bottom
- Back button and header ("Q1: Foundation", "1/12 weeks") render correctly
- Decorative props are tiny dots barely visible
- No node labels (Week 1, Week 2, etc.) visible at this zoom

#### Observations (002)
- Nodes marginally bigger but same clustering problem
- Sine wave X spread too narrow -- nodes still hug left side
- 140px vertical spacing still not enough relative to screen height
- Background fills correctly now (no hardcoded bounds), but camera centering puts avatar at bottom of viewport with massive empty space above

#### Console Warnings
- `DRAW_MODES.$$typeof` deprecation: Pixi v8 internal, cosmetic only, no fix needed
- `EXGL: gl.pixelStorei()`: Known expo-gl limitation, non-fatal
- These do not affect rendering

---

## Known Issues & Debug Log

### ISSUE-001: Viewport only fills bottom-left corner of screen (PARTIALLY FIXED)

**Status:** Fix committed but NOT yet verified on device.  
**Commits:** `ba58dda` (normalized coords), `f091503` (pixel ratio fix)  
**Files:** `PixiCanvas.tsx`, `journey-paths.ts`

#### Symptom
The Pixi canvas renders but only fills approximately the bottom-left 1/3 of the GLView. The map is functional (scrollable, nodes tappable), but appears as a small viewport with content clipped behind the surrounding React Native layers. Scrolling works but only within this small region.

#### Root Cause Analysis (2 bugs, stacked)

**Bug 1: Hardcoded pixel coordinates for path nodes**
- Path generation used `mapWidth = 390` (hardcoded pixels) for node X positions
- On any screen wider than 390px, nodes cluster on the left side
- Fix: Switched to **normalized X coordinates (0..1)** in `journey-paths.ts`. The renderer calls `resolveNodePos(node, screenWidth)` to scale X to actual screen width at draw time.

**Bug 2: Device pixel ratio mismatch (THE MAIN BUG)**
- `expo-gl` creates a WebGL framebuffer at the **native pixel resolution** (e.g., 1290x2796 on a 3x Retina iPhone 15 Pro at 430x932 logical points)
- `onLayout` reports **logical points** (430x932)
- Pixi was initialized with `width: 430, height: 932` but rendering into a framebuffer that's 1290x2796
- Result: Pixi renders into the bottom-left 430x932 *pixels* of a 1290x2796 framebuffer, appearing as ~1/3 of the view
- **This is the classic expo-gl + Pixi.js trap** -- the GL context operates in pixels, React Native operates in points

#### Fix Applied
```typescript
// In onContextCreate:
const scale = Platform.OS === 'web' ? 1 : PixelRatio.get();
const glWidth = gl.drawingBufferWidth || dimensions.width * scale;
const glHeight = gl.drawingBufferHeight || dimensions.height * scale;

// Pixi canvas initialized at native pixel size
const mockCanvas = createMockCanvas(gl, glWidth, glHeight);
await app.init({ width: glWidth, height: glHeight, ... });

// World container scaled so logical-point coordinates work
world.scale.set(scale);

// Camera offset converted from points to pixels
world.x = -cam.x * scale;
world.y = -cam.y * scale;
```

#### What Still Needs Verification
1. Does the map now fill the full screen on iOS simulator?
2. Does scrolling/panning work correctly at the scaled coordinates?
3. Do node taps land on the correct nodes (hit areas in logical points, rendering in pixels)?
4. Does the web build still work (scale=1 on web should be no-op)?
5. Are text labels readable at 3x scale (font sizes may need adjustment)?

#### Key Insight for Future Developers
**Any time you see content rendering in only a fraction of the GLView, check `PixelRatio.get()`.** The expo-gl framebuffer is ALWAYS at native pixel resolution. You must either:
- Initialize Pixi at `gl.drawingBufferWidth x gl.drawingBufferHeight` and scale your world container by `PixelRatio.get()`, OR
- Initialize Pixi at logical dimensions and set `resolution: PixelRatio.get()` (Pixi handles scaling internally)

We chose option 1 because it gives us explicit control over the coordinate space.

### ISSUE-002: Hot reload crash (_cancelResize is not a function)

**Status:** Fixed (try/catch guard).  
**Commit:** `ba58dda`  
**File:** `PixiCanvas.tsx`

#### Symptom
On React Native hot reload, `TypeError: this._cancelResize is not a function (it is null)` thrown during `app.destroy()`.

#### Root Cause
Pixi's Application destroy path calls `this._cancelResize()` from ResizePlugin. Since we initialize with `resizeTo: undefined`, the resize plugin never sets up `_cancelResize`, leaving it null. When hot reload triggers unmount, `destroy()` hits the null function.

#### Fix
```typescript
useEffect(() => {
  return () => {
    const app = appRef.current;
    if (app) {
      try {
        app.ticker.stop();
        app.stage.removeChildren();
        app.destroy(true, { children: true });
      } catch {
        // Pixi destroy may throw during hot reload
      }
    }
    appRef.current = null;
    worldRef.current = null;
  };
}, []);
```

### ISSUE-003: Path node layout cramped (FIXED)

**Status:** Fixed.  
**Commit:** `ba58dda`  
**File:** `journey-paths.ts`

Path nodes were generated with fixed pixel X coordinates in a 390px-wide box. Now uses normalized coordinates (0..1) with a 3-column snake pattern at 20%/50%/80% of screen width. Monthly vertical spacing increased from ~80pt to 240pt. Weekly spacing increased to 160pt.
