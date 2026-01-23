# OHW Health Journey Map

An interactive isometric health journey visualization for the Operation Health and Wellness (OHW) app. Built with Phaser 3 + Next.js.

## Project Structure

```
OHW_map_demo1/
├── engine/                    # Phaser 3 + Next.js game engine
│   ├── app/
│   │   ├── components/
│   │   │   ├── game/          # Core game logic
│   │   │   │   ├── phaser/    # Phaser scene, rendering
│   │   │   │   └── *.ts       # Types, utilities
│   │   │   └── ui/            # React UI components
│   │   ├── data/
│   │   │   └── buildings.ts   # Milestone/building registry
│   │   └── services/
│   │       └── gemini/        # AI asset generation
│   └── public/                # Sprites, tiles, assets
├── docs/
│   ├── ai-workflow/           # AI sprite generation guides
│   ├── client-reference/      # OHW client documentation
│   └── user-journeys/         # Patient/provider journey maps
└── features/                  # Feature specifications
```

## Quick Start

```bash
cd engine
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework:** Next.js 16 + React 19
- **Game Engine:** Phaser 3.90
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5
- **AI Assets:** Gemini 3 Pro via OpenRouter (~$0.03-0.13/image)

## Health Journey Concept

The map visualizes a patient's 12-month health journey as an isometric game world:

- **Milestones** = Buildings/landmarks (weight goals, activity streaks, etc.)
- **Path** = Journey progress (completed sections vs future goals)
- **Character** = User avatar walking through their health journey
- **Quarters** = Q1-Q4 representing different phases of the program

## AI Asset Generation

Generate custom health-themed sprites using Gemini 3 Pro:

1. Set `OPENROUTER_API_KEY` in `.env.local`
2. Use the in-game asset generator or API
3. ~$0.03-0.13 per image

See `docs/ai-workflow/` for detailed guides.

## Key Files

| File | Purpose |
|------|---------|
| `engine/app/components/game/phaser/MainScene.ts` | Core Phaser rendering |
| `engine/app/components/game/GameBoard.tsx` | React state management |
| `engine/app/data/buildings.ts` | Milestone/building registry |
| `engine/app/services/gemini/` | AI asset generation |

## License

MIT (code) - Create your own assets for production.
