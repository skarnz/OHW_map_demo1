# OHW Health Journey Map - Claude Guidelines

## Project Overview

This is an isometric health journey visualization for the OHW medical app. Patients see their 12-month wellness journey as a game world with milestones as buildings, paths as progress, and their avatar walking through the journey.

## Tech Stack

- **Framework:** Next.js 16 + React 19 + TypeScript 5
- **Game Engine:** Phaser 3.90 (loaded dynamically, no SSR)
- **Styling:** Tailwind CSS 4
- **AI Assets:** Gemini 3 Pro via OpenRouter

## Commands

```bash
cd engine
npm run dev     # Development server (localhost:3000)
npm run build   # Production build
npm run lint    # ESLint
```

## Project Structure

```
/engine
  /app
    /components
      /game
        /phaser           # Phaser game engine
          MainScene.ts    # Core rendering & game logic
          PhaserGame.tsx  # React wrapper
        GameBoard.tsx     # Main React component
        types.ts          # Enums, interfaces
      /ui                 # React UI components
    /data
      buildings.ts        # Milestone/building registry
    /services
      /gemini             # AI asset generation
  /public
    /Building             # Building sprites by category
    /Tiles                # Ground tiles
    /Characters           # Walking animations
    /Props                # Decorations, trees
```

## Architecture

**React-Phaser Communication:**
- React manages: grid state, UI, journey data
- Phaser manages: rendering, animations, camera
- React → Phaser: via ref methods
- Phaser → React: via callbacks

**Isometric System:**
- Tile size: 44x22 pixels (2:1 isometric)
- Grid: 48x48 tiles
- Depth sorting: `depth = (x + y) * DEPTH_MULTIPLIER`

## Health Journey Adaptation

### Milestone Categories
- `weight_milestone` - Weight loss goals (5lb, 10lb, etc.)
- `activity_milestone` - Workout streaks, first workout
- `nutrition_milestone` - Healthy eating achievements
- `wellness_milestone` - Meditation, hydration goals

### Journey Structure
- **Q1 (Months 1-3):** Basic Foundation
- **Q2 (Months 4-6):** Active Progress
- **Q3 (Months 7-9):** Strategic Goals
- **Q4 (Months 10-12):** Ultimate Wellbeing

### Key Modifications from City Builder
1. Remove build tools - journey is auto-generated
2. Path = health journey progress
3. Buildings = milestone achievements
4. Character = user avatar
5. Lock/unlock based on progress

## AI Asset Generation

Use Gemini 3 Pro (~$0.03-0.13/image) via OpenRouter:

```typescript
// Prompt template for health milestone
Create an isometric health milestone building:
- Style: modern, clean, wellness-themed
- Size: 2x2 tile footprint
- Theme: [weight loss / fitness / nutrition / wellness]
- View: front-facing isometric (south)
- Background: pure white, transparent
```

## Adding New Milestones

In `engine/app/data/buildings.ts`:

```typescript
"5lb-milestone": {
  id: "5lb-milestone",
  name: "5 Pounds Lost",
  category: "weight_milestone",
  footprint: { width: 2, height: 2 },
  sprites: { south: "/Building/milestones/2x2milestone_5lb.png" },
  icon: "🎯",
}
```

## Important Notes

- This is a MEDICAL app - accuracy and clarity are critical
- Journey lengths vary by patient - must be dynamic
- Mobile-first - touch controls essential
- Locked milestones should be visually distinct
- Celebrations when milestones are achieved
