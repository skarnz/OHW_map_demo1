# OHW Health Journey Map - Adaptation Guide

This guide shows how to transform the Pogicity engine into a health journey visualization for OHW.

## Step 1: Simplify the Package

Remove unnecessary features:

```bash
# Remove these folders/files
rm -rf app/api
rm -rf app/services
rm app/components/ui/AssetGeneratorModal.tsx
rm app/components/ui/MusicPlayer.tsx
rm -rf public/audio  # If not using sounds
```

Update `package.json` - remove if not using AI generation:
```json
{
  "dependencies": {
    "gifuct-js": "^2.1.2",
    "next": "16.1.1",
    "phaser": "^3.90.0",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  }
}
```

## Step 2: Define Health Journey Types

Update `app/components/game/types.ts`:

```typescript
// Replace TileType with journey-specific types
export enum TileType {
  Grass = "grass",           // Unexplored area
  Path = "path",             // Active journey path
  CompletedPath = "completed", // Achieved sections
  Milestone = "milestone",   // Special milestone tile
}

// Replace ToolType (simplified for journey view)
export enum ToolType {
  None = "none",
  View = "view",             // Pan/zoom only
  Interact = "interact",     // Tap milestones
}

// Journey-specific character
export enum CharacterType {
  User = "user",
  Coach = "coach",
}

// Health milestone data
export interface HealthMilestone {
  id: string;
  type: 'weight' | 'activity' | 'nutrition' | 'wellness';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  completed: boolean;
  completedAt?: Date;
  gridX: number;
  gridY: number;
}
```

## Step 3: Create Health Milestone Buildings

Update `app/data/buildings.ts`:

```typescript
export type BuildingCategory = 
  | "weight_milestone"
  | "activity_milestone"
  | "nutrition_milestone"
  | "wellness_milestone"
  | "decoration";

export const BUILDINGS: Record<string, BuildingDefinition> = {
  // Weight Milestones
  "milestone-5lb": {
    id: "milestone-5lb",
    name: "5 Pounds Lost",
    category: "weight_milestone",
    footprint: { width: 2, height: 2 },
    sprites: { south: "/Building/milestones/2x2milestone_5lb.png" },
    icon: "🎯",
  },
  "milestone-10lb": {
    id: "milestone-10lb",
    name: "10 Pounds Lost",
    category: "weight_milestone",
    footprint: { width: 3, height: 3 },
    sprites: { south: "/Building/milestones/3x3milestone_10lb.png" },
    icon: "🏆",
  },
  
  // Activity Milestones
  "first-workout": {
    id: "first-workout",
    name: "First Workout",
    category: "activity_milestone",
    footprint: { width: 1, height: 1 },
    sprites: { south: "/Props/milestones/1x1first_workout.png" },
    icon: "💪",
  },
  "workout-streak-7": {
    id: "workout-streak-7",
    name: "7 Day Streak",
    category: "activity_milestone",
    footprint: { width: 2, height: 2 },
    sprites: { south: "/Building/milestones/2x2streak_7.png" },
    icon: "🔥",
  },
  
  // Journey Decorations
  "tree-healthy": {
    id: "tree-healthy",
    name: "Health Tree",
    category: "decoration",
    footprint: { width: 1, height: 1 },
    renderSize: { width: 3, height: 3 },
    sprites: { south: "/Props/journey/1x1health_tree.png" },
    icon: "🌳",
    isDecoration: true,
  },
  "fountain-wellness": {
    id: "fountain-wellness",
    name: "Wellness Fountain",
    category: "decoration",
    footprint: { width: 2, height: 2 },
    sprites: { south: "/Props/journey/2x2wellness_fountain.png" },
    icon: "⛲",
    isDecoration: true,
  },
};
```

## Step 4: Create Journey Map Component

Create `app/components/journey/JourneyMap.tsx`:

```typescript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GridCell, TileType, GRID_WIDTH, GRID_HEIGHT, Direction } from "../game/types";
import dynamic from "next/dynamic";
import type { PhaserGameHandle } from "../game/phaser/PhaserGame";

const PhaserGame = dynamic(() => import("../game/phaser/PhaserGame"), {
  ssr: false,
  loading: () => <div className="loading">Loading your journey...</div>,
});

interface JourneyMapProps {
  milestones: HealthMilestone[];
  userProgress: number; // 0-100 percentage
  onMilestoneClick?: (milestone: HealthMilestone) => void;
}

export default function JourneyMap({ 
  milestones, 
  userProgress,
  onMilestoneClick 
}: JourneyMapProps) {
  const [grid, setGrid] = useState<GridCell[][]>(() => generateJourneyGrid(milestones));
  const [zoom, setZoom] = useState(1);
  const phaserRef = useRef<PhaserGameHandle>(null);

  // Generate the journey path based on milestones
  function generateJourneyGrid(milestones: HealthMilestone[]): GridCell[][] {
    const grid = createEmptyGrid();
    
    // Generate a winding path through milestones
    let lastX = 4, lastY = GRID_HEIGHT - 4;
    
    for (const milestone of milestones) {
      // Draw path to this milestone
      drawPath(grid, lastX, lastY, milestone.gridX, milestone.gridY, milestone.completed);
      
      // Place milestone building
      placeMilestone(grid, milestone);
      
      lastX = milestone.gridX;
      lastY = milestone.gridY;
    }
    
    return grid;
  }

  // Spawn user character at their progress point
  useEffect(() => {
    if (phaserRef.current) {
      phaserRef.current.spawnCharacter();
    }
  }, [userProgress]);

  const handleTileClick = useCallback((x: number, y: number) => {
    const cell = grid[y]?.[x];
    if (cell?.buildingId) {
      const milestone = milestones.find(m => 
        m.gridX === cell.originX && m.gridY === cell.originY
      );
      if (milestone && onMilestoneClick) {
        onMilestoneClick(milestone);
      }
    }
  }, [grid, milestones, onMilestoneClick]);

  return (
    <div className="journey-map-container">
      <PhaserGame
        ref={phaserRef}
        grid={grid}
        selectedTool={ToolType.View}
        selectedBuildingId={null}
        buildingOrientation={Direction.Down}
        zoom={zoom}
        onTileClick={handleTileClick}
        onZoomChange={setZoom}
        showStats={false}
      />
      
      {/* Progress indicator */}
      <div className="journey-progress">
        <div className="progress-bar" style={{ width: `${userProgress}%` }} />
        <span>{userProgress}% Complete</span>
      </div>
    </div>
  );
}
```

## Step 5: Create Custom Sprites

Create health-themed sprites for:

### Directory Structure
```
public/
├── Building/
│   └── milestones/
│       ├── 2x2milestone_5lb.png
│       ├── 2x2milestone_10lb.png
│       ├── 3x3milestone_25lb.png
│       └── ...
├── Props/
│   └── journey/
│       ├── 1x1health_tree.png
│       ├── 2x2wellness_fountain.png
│       └── ...
├── Characters/
│   ├── userwalkeast.gif
│   ├── userwalknorth.gif
│   ├── userwalksouth.gif
│   └── userwalkwest.gif
└── Tiles/
    ├── 1x1grass.png      (unexplored)
    ├── 1x1path.png       (active journey)
    └── 1x1completed.png  (achieved)
```

### Sprite Guidelines

1. **Milestones:** Celebratory monuments (trophies, flags, medals)
2. **Path tiles:** Softer colors, health-themed
3. **User character:** Friendly, encouraging avatar
4. **Decorations:** Trees, flowers, wellness symbols

## Step 6: Integration with OHW Backend

```typescript
// Example: Fetch user's journey data
async function loadUserJourney(userId: string) {
  const response = await fetch(`/api/users/${userId}/journey`);
  const data = await response.json();
  
  return {
    milestones: data.milestones.map(m => ({
      ...m,
      // Assign grid positions based on journey order
      gridX: calculateMilestoneX(m.order),
      gridY: calculateMilestoneY(m.order),
    })),
    progress: data.overallProgress,
  };
}

// Calculate milestone positions for a winding path
function calculateMilestoneX(order: number): number {
  const segment = Math.floor(order / 4);
  const position = order % 4;
  
  if (segment % 2 === 0) {
    // Going right
    return 4 + position * 8;
  } else {
    // Going left
    return 28 - position * 8;
  }
}

function calculateMilestoneY(order: number): number {
  const segment = Math.floor(order / 4);
  return GRID_HEIGHT - 4 - segment * 6;
}
```

## Step 7: Add Celebration Animations

When user reaches a milestone:

```typescript
// In MainScene.ts - add celebration method
celebrateMilestone(x: number, y: number): void {
  const screenPos = this.gridToScreen(x, y);
  
  // Screen shake
  this.shakeScreen("y", 2, 300);
  
  // Particle burst (add particles plugin)
  const particles = this.add.particles(screenPos.x, screenPos.y - 50, 'confetti', {
    speed: { min: 100, max: 200 },
    angle: { min: 240, max: 300 },
    lifespan: 2000,
    quantity: 20,
    scale: { start: 0.5, end: 0 },
  });
  
  particles.explode();
}
```

## Summary: Key Changes from Pogicity

| Original | OHW Adaptation |
|----------|----------------|
| City buildings | Health milestones |
| Roads | Journey path |
| Citizens walking | User avatar |
| Cars | Remove or replace with "motivation boosters" |
| Build tools | View-only mode |
| Save/Load | Sync with backend |
| Multiple categories | Weight/Activity/Nutrition/Wellness |

## Next Steps

1. Design milestone sprites with your designer
2. Define the full milestone progression
3. Integrate with Supabase for user data
4. Add celebration animations
5. Implement milestone detail modals
6. Add coach NPC interactions
