# OHW Isometric Map Engine

Extracted from Pogicity - an isometric city builder engine built with **Phaser 3** and **Next.js**.

This is a foundation for building an isometric health journey map for the OHW (Operation Health and Wellness) app.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework:** Next.js 16 with React 19
- **Game Engine:** Phaser 3.90
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5
- **GIF Support:** gifuct-js for character animations

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  REACT (GameBoard.tsx)                                       │
│  ═══════════════════════                                     │
│  - Grid state (48x48 tiles)                                  │
│  - Tool selection                                            │
│  - UI panels & modals                                        │
│  - Save/Load to localStorage                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │ grid, callbacks
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASER (MainScene.ts)                                       │
│  ═══════════════════════                                     │
│  - Isometric rendering                                       │
│  - Character/car movement                                    │
│  - Camera controls                                           │
│  - Sprite depth sorting                                      │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `app/components/game/GameBoard.tsx` | Main React component, state management |
| `app/components/game/phaser/MainScene.ts` | Core Phaser scene, all rendering |
| `app/components/game/phaser/PhaserGame.tsx` | React wrapper for Phaser |
| `app/components/game/types.ts` | TypeScript types, grid/tile definitions |
| `app/components/game/roadUtils.ts` | Road network logic |
| `app/data/buildings.ts` | Building registry (add buildings here) |
| `app/components/game/phaser/gameConfig.ts` | Phaser game configuration |

## Isometric System

### Tile Dimensions
- **Tile size:** 44x22 pixels (2:1 isometric)
- **Grid size:** 48x48 tiles (configurable in `types.ts`)

### Coordinate Conversion

```typescript
// Grid → Screen
function gridToScreen(gridX: number, gridY: number) {
  return {
    x: OFFSET_X + (gridX - gridY) * (TILE_WIDTH / 2),
    y: OFFSET_Y + (gridX + gridY) * (TILE_HEIGHT / 2)
  };
}

// Screen → Grid
function screenToGrid(screenX: number, screenY: number) {
  const relX = screenX - OFFSET_X;
  const relY = screenY - OFFSET_Y;
  return {
    x: (relX / (TILE_WIDTH / 2) + relY / (TILE_HEIGHT / 2)) / 2,
    y: (relY / (TILE_HEIGHT / 2) - relX / (TILE_WIDTH / 2)) / 2
  };
}
```

### Depth Sorting

```typescript
// Objects further "back" drawn first
depth = (gridX + gridY) * DEPTH_MULTIPLIER + layerOffset;

// Layer offsets:
// 0.00 - Ground tiles
// 0.05 - Buildings
// 0.06 - Props/trees
// 0.10 - Cars
// 0.20 - Characters
```

## Adapting for OHW Health Journey Map

### Concept: Health Milestones as Buildings

Replace city buildings with health journey milestones:

```typescript
// app/data/buildings.ts - Add health milestones
"weight-loss-5lb": {
  id: "weight-loss-5lb",
  name: "5lb Milestone",
  category: "milestone",
  footprint: { width: 2, height: 2 },
  sprites: {
    south: "/Building/milestones/2x2milestone_5lb.png",
  },
  icon: "🏆",
},
"first-workout": {
  id: "first-workout",
  name: "First Workout",
  category: "achievement",
  footprint: { width: 1, height: 1 },
  sprites: {
    south: "/Props/achievements/1x1first_workout.png",
  },
  icon: "💪",
},
```

### Suggested OHW Categories

| Category | Use Case |
|----------|----------|
| `milestone` | Weight loss goals (5lb, 10lb, etc.) |
| `achievement` | First workout, streak achievements |
| `wellness` | Meditation spots, water intake |
| `nutrition` | Healthy meal achievements |
| `activity` | Exercise locations on the journey |

### Character as User Avatar

The walking characters can represent the user's journey progress:

```typescript
// Modify CharacterType in types.ts
export enum CharacterType {
  User = "user",        // Main user avatar
  Coach = "coach",      // Health coach NPC
  Buddy = "buddy",      // Accountability partner
}
```

### Path = Health Journey

The road network can represent the user's health journey path:
- **Sidewalk (gray tiles):** Future milestones
- **Asphalt (dark tiles):** Completed journey sections
- **Character position:** Current progress point

### Suggested Modifications

1. **Remove city-builder tools** - Keep only milestone placement
2. **Auto-generate path** - Based on user's health plan
3. **Unlock buildings** - As user achieves milestones
4. **Add animations** - Celebrations when reaching milestones
5. **Simplify UI** - Remove build menu, add progress view

## Adding Custom Assets

### Sprite Requirements

| Property | Value |
|----------|-------|
| Tile size | 44x22 pixels |
| Canvas size | 512x512 (or larger for big items) |
| Anchor point | Bottom-center (front corner) |
| Format | PNG with transparency |
| Naming | `{width}x{height}{name}_{direction}.png` |

### Adding a New Milestone

1. Create sprite at `public/Building/milestones/`
2. Register in `app/data/buildings.ts`:

```typescript
"my-milestone": {
  id: "my-milestone",
  name: "My Milestone",
  category: "milestone",
  footprint: { width: 2, height: 2 },
  sprites: {
    south: "/Building/milestones/2x2my_milestone.png",
  },
  icon: "⭐",
}
```

## Mobile Considerations

The engine includes basic mobile support but works best on desktop. For OHW mobile app:

1. Consider using React Native with a WebView wrapper
2. Simplify interactions to tap-only
3. Reduce grid size for performance
4. Pre-render map sections as static images

## Performance Tips

- **Chunk rendering** for large maps
- **LOD (Level of Detail)** when zoomed out
- **Limit active characters** (50-100 max)
- **Use sprite sheets** instead of individual images

## License

MIT License (code only). Create your own assets for production use.

---

## Original Pogicity Features (Can Remove)

- AI Asset Generator (uses Gemini API)
- Christmas buildings category
- Car driving mode
- Music player

These can be safely removed by deleting:
- `app/api/` folder
- `app/services/` folder
- `app/components/ui/AssetGeneratorModal.tsx`
- `app/components/ui/MusicPlayer.tsx`
- Christmas buildings from `buildings.ts`
