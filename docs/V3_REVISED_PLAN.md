# OHW Journey Map V3 - Revised Plan

## Status: IN PROGRESS - Implementation Tracking

This revision incorporates reviewer feedback while preserving the core game experience the client wants.

---

## Executive Summary

**What Changed:**
- 4 Phaser scenes → **1 React Native menu + 3 Pixi.js scenes**
- Procedural paths → **Path configs (hard-coded but flexible)**
- 16 seasonal palettes → **4 palettes (one per quarter, no seasons for V1)**
- 7 phases → **5 phases with app integration in Phase 1**
- Phaser (WebView) → **Pixi.js + expo-gl (native rendering)**

**What We're Keeping:**
- Mario-style game feel (tap, walk, celebrate)
- 4-layer navigation (Quarterly menu → Monthly → Weekly → Daily)
- Cloud transitions between scenes
- Dynamic journey lengths via path configs
- 1 avatar with 3 animations
- Full Q1-Q4 biome progression

---

## 1. Platform Architecture

### Tech Stack

```
Expo SDK 50+ (React Native)
├── expo-gl           → WebGL context for Pixi.js
├── pixi.js v8        → 2D game rendering (native performance, custom GL adapter)
├── react-native-gesture-handler → Native touch (pan, pinch, tap)
├── react-native-reanimated      → Smooth UI animations
├── expo-audio        → Native audio (sound effects)
└── Supabase          → Backend (existing OHW infrastructure)
```

### Why Pixi.js + Expo (Option B)

| Factor | WebView + Phaser | Pixi.js + expo-gl |
|--------|------------------|-------------------|
| Touch latency | ~50-100ms | ~16ms |
| Game feel | 7/10 | 9/10 |
| Integration with Expo app | Awkward (postMessage) | Native (shared state) |
| Future maintenance | Two codebases | One codebase |
| Performance | WebView overhead | Native GL |

**Decision:** Pixi.js + expo-gl for native game feel.

---

## 2. 4-Layer Navigation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: QUARTERLY VIEW (React Native UI - Not a game scene)│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│   │   Q1    │ │   Q2    │ │   Q3    │ │   Q4    │          │
│   │Wilderness│ │  Town   │ │ Suburbs │ │  City   │          │
│   │   🔓    │ │   🔒    │ │   🔒    │ │   🔒    │          │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│   [Animated cards with biome preview thumbnails]            │
│   [Current quarter highlighted, others locked/unlocked]     │
│   [Tap quarter → enters Monthly "World Map" scene]          │
│                                                             │
│   Implementation: React Native + Reanimated                 │
│   Why not Pixi: Simple UI, no game logic needed             │
└─────────────────────────────────────────────────────────────┘
                              │
                        Tap Quarter Card
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 2: MONTHLY VIEW (Pixi.js Scene 1 - "World Map")       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   The full quarter as a scrollable/pannable game world      │
│                                                             │
│   • 4-12 week nodes connected by winding paths              │
│   • Biome theme applied (Wilderness/Town/Suburbs/City)      │
│   • Seasonal palette applied (Spring/Summer/Fall/Winter)    │
│   • Decorative props (trees, buildings, water features)     │
│   • Avatar indicator dot shows current week position        │
│   • Locked weeks shown greyed out with lock icon            │
│                                                             │
│   Interactions:                                             │
│   • Pan/drag to explore the map                             │
│   • Tap week node → cloud transition → Weekly scene         │
│   • Pinch gesture → zoom (cosmetic, stays in Monthly)       │
│                                                             │
│   Path Config: Loaded from journey-paths.ts based on        │
│   journey length (4-week, 12-week, 24-week, custom)         │
└─────────────────────────────────────────────────────────────┘
                              │
                      Cloud Transition
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 3: WEEKLY VIEW (Pixi.js Scene 2 - "Level Select")     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   The selected week zoomed in with day-level detail         │
│                                                             │
│   • 5-7 day nodes on a winding path                         │
│   • Avatar VISIBLE - walks between completed days           │
│   • More detailed environment art than Monthly              │
│   • Day nodes show category icons (nutrition, movement...)  │
│   • Progress indicators on each day node                    │
│                                                             │
│   Interactions:                                             │
│   • Pan to see full week path                               │
│   • Tap day node → cloud transition → Daily scene           │
│   • Watch avatar walk to current day on scene entry         │
│   • Back button → cloud transition → Monthly scene          │
└─────────────────────────────────────────────────────────────┘
                              │
                      Cloud Transition
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 4: DAILY VIEW (Pixi.js Scene 3 - "Mission Hub")       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Today's tasks as interactive mission nodes                │
│                                                             │
│   • 4-6 task nodes arranged in a small area                 │
│     - Medication 💊                                         │
│     - Nutrition 🥗                                          │
│     - Movement 🏃                                           │
│     - Wellness 🧘                                           │
│     - Check-in 📝                                           │
│   • Avatar at center, walks to each task when tapped        │
│   • Detailed props and environment for immersion            │
│   • Task nodes show completion state clearly                │
│                                                             │
│   Interactions:                                             │
│   • Tap task node → Avatar walks to it → Opens native screen│
│   • Complete task in native screen → Return here            │
│   • Celebration plays → Points awarded → Node marked done   │
│   • All tasks done → Day complete celebration               │
│   • Back button → cloud transition → Weekly scene           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Path Configuration System

Instead of procedural generation, we use **flexible path configs**:

```typescript
// src/data/journey-paths.ts

export interface PathNode {
  id: string;
  x: number;
  y: number;
  type: 'week' | 'day' | 'task';
}

export interface PathConfig {
  id: string;
  name: string;
  weekCount: number;
  monthlyPath: PathNode[];      // Week nodes for Monthly view
  weeklyPaths: Record<string, PathNode[]>;  // Day nodes per week
  dailyLayout: PathNode[];      // Task node positions (reusable)
}

// Pre-defined configs for common journey lengths
export const PATH_CONFIGS: Record<string, PathConfig> = {
  
  // Standard 12-week (3 month) journey
  "12-week": {
    id: "12-week",
    name: "Standard Quarter",
    weekCount: 12,
    monthlyPath: [
      { id: "w1", x: 120, y: 800, type: "week" },
      { id: "w2", x: 280, y: 720, type: "week" },
      { id: "w3", x: 180, y: 620, type: "week" },
      { id: "w4", x: 320, y: 540, type: "week" },
      // ... winding snake pattern up the screen
      { id: "w12", x: 200, y: 100, type: "week" },
    ],
    weeklyPaths: {
      "w1": [
        { id: "d1", x: 80, y: 400, type: "day" },
        { id: "d2", x: 160, y: 350, type: "day" },
        { id: "d3", x: 240, y: 380, type: "day" },
        { id: "d4", x: 320, y: 320, type: "day" },
        { id: "d5", x: 280, y: 250, type: "day" },
        { id: "d6", x: 200, y: 200, type: "day" },
        { id: "d7", x: 120, y: 150, type: "day" },
      ],
      // ... other weeks
    },
    dailyLayout: [
      { id: "medication", x: 200, y: 150, type: "task" },
      { id: "nutrition", x: 300, y: 250, type: "task" },
      { id: "movement", x: 200, y: 350, type: "task" },
      { id: "wellness", x: 100, y: 250, type: "task" },
      { id: "checkin", x: 200, y: 250, type: "task" },  // Center
    ],
  },

  // Short 4-week journey
  "4-week": {
    id: "4-week",
    name: "Quick Start",
    weekCount: 4,
    monthlyPath: [
      { id: "w1", x: 150, y: 600, type: "week" },
      { id: "w2", x: 250, y: 450, type: "week" },
      { id: "w3", x: 150, y: 300, type: "week" },
      { id: "w4", x: 250, y: 150, type: "week" },
    ],
    weeklyPaths: { /* ... */ },
    dailyLayout: { /* same as 12-week */ },
  },

  // Extended 24-week (6 month) journey
  "24-week": {
    id: "24-week",
    name: "Extended Journey",
    weekCount: 24,
    monthlyPath: [ /* ... more nodes, tighter spacing */ ],
    weeklyPaths: { /* ... */ },
    dailyLayout: { /* same */ },
  },
};

// Generate custom path config for arbitrary length
export function generatePathConfig(weekCount: number): PathConfig {
  const monthlyPath: PathNode[] = [];
  const weeklyPaths: Record<string, PathNode[]> = {};
  
  // Snake pattern algorithm
  const mapHeight = 1000;
  const nodeSpacing = mapHeight / (weekCount + 1);
  
  for (let i = 0; i < weekCount; i++) {
    const isEvenRow = Math.floor(i / 3) % 2 === 0;
    const xPosition = isEvenRow 
      ? 100 + (i % 3) * 100 
      : 300 - (i % 3) * 100;
    
    monthlyPath.push({
      id: `w${i + 1}`,
      x: xPosition,
      y: mapHeight - (i * nodeSpacing),
      type: "week",
    });
    
    // Generate 7-day path for each week
    weeklyPaths[`w${i + 1}`] = generateWeekPath(i + 1);
  }
  
  return {
    id: `custom-${weekCount}`,
    name: `${weekCount}-Week Journey`,
    weekCount,
    monthlyPath,
    weeklyPaths,
    dailyLayout: PATH_CONFIGS["12-week"].dailyLayout,
  };
}

function generateWeekPath(weekNumber: number): PathNode[] {
  // Consistent 7-day snake pattern
  return [
    { id: "d1", x: 80, y: 400, type: "day" },
    { id: "d2", x: 160, y: 340, type: "day" },
    { id: "d3", x: 240, y: 380, type: "day" },
    { id: "d4", x: 320, y: 320, type: "day" },
    { id: "d5", x: 280, y: 250, type: "day" },
    { id: "d6", x: 200, y: 190, type: "day" },
    { id: "d7", x: 120, y: 130, type: "day" },
  ];
}
```

**Key Benefits:**
- Predictable layouts (no procedural bugs)
- Easy to hand-tune specific paths
- Supports any journey length via `generatePathConfig()`
- Path data stored in simple JSON (easy to debug/modify)

---

## 4. Scene Communication Contract

Based on Kieran's review - explicit boundary between React Native and Pixi.js:

```typescript
// src/game/contracts.ts

/**
 * REACT NATIVE → PIXI.JS (via props/context)
 * These values flow INTO the game scenes
 */
export interface GameSceneProps {
  // Scene identification
  sceneType: 'monthly' | 'weekly' | 'daily';
  
  // Journey data (read-only in Pixi)
  journeyId: string;
  currentQuarter: 1 | 2 | 3 | 4;
  currentWeek: number;
  currentDay: number;
  
  // Path config (loaded based on journey length)
  pathConfig: PathConfig;
  
  // Node states (managed by React, rendered by Pixi)
  nodeStates: Record<string, NodeState>;
  
  // Visual settings
  biome: 'wilderness' | 'town' | 'suburbs' | 'city';
  season: 'spring' | 'summer' | 'fall' | 'winter';
  
  // Avatar state
  avatarPosition: { nodeId: string };
}

/**
 * PIXI.JS → REACT NATIVE (via callbacks)
 * These events flow OUT of the game scenes
 */
export interface GameSceneCallbacks {
  // Navigation
  onNodeTapped: (nodeId: string, nodeType: 'week' | 'day' | 'task') => void;
  onBackPressed: () => void;
  
  // Scene lifecycle
  onSceneReady: () => void;
  onTransitionComplete: () => void;
  
  // Avatar events
  onAvatarArrived: (nodeId: string) => void;
  onCelebrationComplete: () => void;
}

/**
 * NODE STATE MACHINE
 * Valid transitions defined explicitly
 */
export type NodeState = 'locked' | 'unlocked' | 'in_progress' | 'completed' | 'skipped';

export const VALID_TRANSITIONS: Record<NodeState, NodeState[]> = {
  locked: ['unlocked'],                    // Calendar date unlocks
  unlocked: ['in_progress', 'skipped'],    // User starts OR day passes
  in_progress: ['completed', 'skipped'],   // User completes OR day passes  
  completed: [],                           // Terminal
  skipped: [],                             // Terminal (no catch-up)
};

export function canTransition(from: NodeState, to: NodeState): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}
```

**Rules:**
1. React Native OWNS all state (journey progress, node states)
2. Pixi.js RENDERS state and emits user actions
3. NO direct state mutation in Pixi scenes
4. All communication via typed props and callbacks
5. Use `useRef` for values that don't need re-render (camera position)
6. Use `useState` only for values that need UI update

---

## 5. Asset Pipeline

### Pre-Generation Strategy (Reviewer Approved)

No runtime image generation. All assets pre-generated at build time.

```
src/assets/
├── manifest.json           # Asset manifest with checksums
├── tiles/
│   ├── wilderness/         # Q1 biome
│   │   ├── grass.png
│   │   ├── dirt-path.png
│   │   ├── water.png
│   │   └── ...
│   ├── town/               # Q2 biome
│   ├── suburbs/            # Q3 biome
│   └── city/               # Q4 biome
├── props/
│   ├── trees/
│   ├── buildings/
│   ├── decorations/
│   └── ...
├── avatar/
│   ├── idle/               # 4 frames
│   ├── walk/               # 6 frames (flip for directions)
│   └── celebrate/          # 6 frames
├── nodes/
│   ├── week-locked.png
│   ├── week-unlocked.png
│   ├── week-completed.png
│   ├── day-locked.png
│   ├── day-unlocked.png
│   ├── day-completed.png
│   ├── task-medication.png
│   ├── task-nutrition.png
│   ├── task-movement.png
│   ├── task-wellness.png
│   └── task-checkin.png
├── ui/
│   ├── cloud-transition.png
│   ├── back-button.png
│   └── ...
└── audio/
    ├── tap.mp3
    ├── walk.mp3
    ├── celebrate.mp3
    └── transition.mp3
```

### Asset Manifest (Kieran's Recommendation)

```json
// src/assets/manifest.json
{
  "version": "1.0.0",
  "generated": "2026-02-11T00:00:00Z",
  "assets": {
    "tiles/wilderness/grass.png": {
      "width": 48,
      "height": 48,
      "checksum": "abc123..."
    },
    // ... all assets listed
  },
  "required": [
    "tiles/wilderness/grass.png",
    "avatar/idle/frame1.png",
    // ... minimum required for app to function
  ]
}
```

### Fallback System

```typescript
// src/game/assets/loader.ts

const PLACEHOLDER_SPRITE = 'assets/ui/placeholder.png';

export async function loadAssetSafe(path: string): Promise<PIXI.Texture> {
  try {
    const texture = await PIXI.Assets.load(path);
    return texture;
  } catch (error) {
    console.warn(`Asset not found: ${path}, using placeholder`);
    return await PIXI.Assets.load(PLACEHOLDER_SPRITE);
  }
}
```

### Nano Banana Workflow (Development Only)

Use Gemini for generating assets during development, then export to static files:

```typescript
// scripts/generate-assets.ts (Dev tool, not production code)

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

async function generateTileAsset(biome: string, tileType: string) {
  const result = await generateText({
    model: google('gemini-2.5-flash-image'),
    prompt: `Create a 48x48 pixel orthogonal top-down game tile:
      - Style: Smooth cartoon pixel art (TinySwords/Pixelfrog style)
      - Biome: ${biome}
      - Tile type: ${tileType}
      - Colors: Soft gradients, warm palette
      - Background: Transparent PNG
      - NO harsh pixel edges, smooth anti-aliased art`,
    providerOptions: {
      google: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '1:1' }
      }
    }
  });
  
  // Save to assets directory
  await saveToFile(`src/assets/tiles/${biome}/${tileType}.png`, result);
}

// Generate all assets
async function generateAllAssets() {
  const biomes = ['wilderness', 'town', 'suburbs', 'city'];
  const tileTypes = ['grass', 'dirt-path', 'water', 'stone'];
  
  for (const biome of biomes) {
    for (const tile of tileTypes) {
      await generateTileAsset(biome, tile);
    }
  }
}
```

---

## 6. Implementation Phases

### Phase 1: Foundation + App Integration (Week 1-2)
**Goal:** Pixi.js rendering in Expo, basic navigation works

- [x] Set up Expo project with expo-gl + pixi.js v8
- [x] Create GLView wrapper component for Pixi rendering
- [x] Implement Quarterly View (React Native cards)
- [x] Create Monthly Scene skeleton (renders colored rectangles)
- [x] Implement cloud transition animation
- [x] **APP INTEGRATION:** Tap placeholder node → opens native screen (mock)
- [x] Basic gesture handling (pan, tap)
- [x] Scene communication contract implemented

**Deliverable:** Can navigate Quarterly → Monthly → (placeholder) with transitions

### Phase 2: Weekly + Daily Scenes (Week 2-3)
**Goal:** All 3 Pixi scenes functional with placeholder art

- [x] Implement Weekly Scene with day nodes
- [x] Implement Daily Scene with task nodes
- [x] Path rendering (bezier curves between nodes)
- [x] Node state visuals (locked/unlocked/completed/skipped)
- [x] Cloud transitions between all scenes
- [x] Back navigation working
- [x] Camera pan with bounds

**Deliverable:** Full 4-layer navigation with placeholder sprites

### Phase 3: Avatar + Interactivity (Week 3-4)
**Goal:** Mario-style game feel

- [x] Avatar with 3 animations (idle, walk, celebrate) *(procedural Graphics; sprite upgrade deferred)*
- [x] Avatar walks along path between nodes
- [x] Camera follows avatar during walk
- [x] Tap node → avatar walks → callback fires
- [x] Celebration effect on task completion
- [x] Sound effects (tap, walk, celebrate, transition, complete) *(5 MP3s synthesized; SoundManager wired on native, gated on web)*
- [x] Points popup animation

**Deliverable:** Feels like a game, avatar walks and celebrates

### Phase 4: Art + Polish (Week 4-5)
**Goal:** TinySwords-quality visuals

- [x] Generate Q1 Wilderness biome assets (Gemini 2.5 Flash Image via OpenRouter)
- [x] Generate Q2 Town biome assets
- [x] Generate Q3 Suburbs biome assets
- [x] Generate Q4 City biome assets
- [x] Decorative props along paths *(procedural vector props with seasonal palette tinting)*
- [x] Node icons for each task type *(Gemini-generated 48x48 PNGs; sprite + procedural fallback at runtime)*
- [x] UI polish (back button, progress indicators)
- [x] Asset manifest validation *(manifest validates; all 42 assets exist on disk; smoke test checks disk presence)*
- [x] Wire sprite-based rendering *(asset registry with static require(), PIXI.Assets, Sprite nodes with procedural fallback)*

**Deliverable:** Looks polished, consistent art style

### Phase 5: Full Journey + Testing (Week 5-6)
**Goal:** Production-ready

- [x] All path configs working (4-week, 8-week, 12-week, 24-week, custom)
- [x] Seasonal palette system (4 seasons × 4 biomes, RGB tint multipliers)
- [x] Performance optimization (GraphicsPool object pooling for scene rebuilds; texture atlases deferred to sprite upgrade)
- [x] Real data integration scaffold (useJourneyData hook wired into navigator; Supabase connection deferred)
- [x] Visual regression tests *(Playwright + web export; baseline screenshots + pixel diff comparison)*
- [ ] Performance benchmarks (60fps on mid-range Android) *(needs physical device)*
- [x] Error boundaries and fallbacks (ErrorBoundary wraps app with retry)
- [x] Android + iOS prebuild *(both platforms prebuild successfully; iOS simulator verified; Android untested on device)*

**Deliverable:** Ship to TestFlight/Play Store internal testing

---

## 7. Figma Design Token Integration

From our extracted design system:

```typescript
// src/theme/figma-tokens.ts

export const COLORS = {
  background: '#F7F7F7',
  card: '#FFFFFF',
  textPrimary: '#0A0A0A',
  textSecondary: '#8C8C8C',
  accentBlue: '#0A84FF',
  accentRed: '#D21737',
  accentYellow: '#D2BD17',
  accentGold: '#FFB200',
  accentTeal: '#00B3A7',
  progressTrack: '#F4F4F4',
};

export const TYPOGRAPHY = {
  h1: { size: 26, weight: 'bold' },
  h2: { size: 18, weight: 'semibold' },
  body: { size: 16, weight: 'regular' },
  caption: { size: 14, weight: 'regular' },
  tabLabel: { size: 13, weight: 'medium' },
};

export const SPACING = {
  screenPadding: 20,
  cardPadding: 18,
  sectionGap: 16,
  cardRadius: 16,
  buttonRadius: 12,
};
```

---

## 8. Success Criteria

### Phase 1-2 (Foundation)
- [ ] Pixi.js renders at 60fps in Expo
- [ ] All 4 layers navigable
- [ ] Cloud transitions feel smooth
- [ ] Tap → native screen works

### Phase 3 (Game Feel)
- [ ] Avatar walk feels like Mario world map
- [ ] Celebrations feel rewarding
- [ ] Touch response < 50ms

### Phase 4-5 (Production)
- [ ] Art style consistent (TinySwords quality)
- [ ] Works on Android + iOS
- [ ] 60fps on iPhone 12+ / Pixel 6+
- [ ] No crashes on edge cases

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| expo-gl + Pixi.js integration issues | Prototype in Week 1, have WebView fallback |
| Performance on older Android | Test early on budget devices, reduce sprite count |
| Art style inconsistency | Strict Gemini prompts + human curation |
| Path configs don't scale | Test with 4/12/24/52 week journeys early |
| Scope creep | Stick to this plan, defer to V3.1 |

---

## 10. What's Deferred to V3.1+

- Multiple avatar presets (V3.1)
- Avatar customization UI (V3.2)
- Branching/hidden paths (V3.2)
- Time-aware avatar emotions (Maybe never)
- Animated biome transitions (V3.1)
- Mini-map in Weekly/Daily (V3.1)
- Offline support (V3.2)

---

*Document created: 2026-02-11*
*Based on: DHH, Kieran, and Simplicity reviewer feedback*
*Platform: Expo + Pixi.js v8 + expo-gl*
