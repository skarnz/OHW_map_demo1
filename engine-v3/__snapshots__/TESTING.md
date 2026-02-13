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
