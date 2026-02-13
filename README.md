# OHW Health Journey Map

An interactive health journey visualization for the Operation Health and Wellness (OHW) app. Currently transitioning from isometric to orthogonal top-down style (TinySwords/Mario-inspired).

## Quick Start

```bash
# V3 (Expo + Pixi.js v8)
cd engine-v3
npm install
npx expo start --web   # or --ios / --android
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| V1 Engine (isometric) | ⚠️ Deprecated | Original prototype |
| V2 Engine (isometric) | 🔧 Broken | Performance issues, infinite loops |
| **V3 Engine (orthogonal)** | 🚧 In Progress | Expo + Pixi v8 native render; Phases 1-5 implemented (assets are placeholders) |
| Asset Pipeline | ⚠️ Placeholder art | Gemini script ready; current sprites/tiles are Pillow placeholders |
| Journey Spec | ✅ Complete | See `docs/user-journeys/journey_map_design_spec.md` |
| Figma Design System | ✅ Extracted | See `docs/figma-exports/` |

---

## File Map

```
OHW_map_demo1/
│
├── README.md                           # You are here
├── AGENTS.md                           # Agent context & session handoffs
├── claude.md                           # Coding guidelines for AI assistants
│
├── .droid/                             # 🤖 Agent tracking (persists across sessions)
│   ├── context/
│   │   ├── learnings.md                # Technical learnings accumulated
│   │   └── decisions.md                # Key architectural decisions
│   └── phases/
│       ├── overview.md                 # Phase status dashboard
│       └── phase-1-skeleton.md         # Phase 1 detailed checklist
│
├── docs/                               # 📚 Documentation & specs
│   ├── ORTHOGONAL_CONVERSION_PLAN.md   # ⭐ V3 MASTER SPEC
│   │
│   ├── figma-exports/                  # Design system from Figma
│   │   ├── design-tokens.md            # Colors, typography, spacing
│   │   └── screens-inventory.md        # All app screens mapped
│   │
│   ├── reference-images/               # Visual references
│   │   ├── mission-journey-concept-1.png
│   │   ├── mission-journey-concept-2.png
│   │   ├── ios-prototype-screenshot.jpg
│   │   └── mario-world-maps/           # Nintendo world map references
│   │
│   ├── user-journeys/                  # Journey design specs
│   │   ├── journey_map_design_spec.md  # ⭐ UX SPEC: 4 zoom levels
│   │   └── patient/                    # Patient journey analysis
│   │
│   ├── ai-workflow/                    # Sprite generation guides
│   │   ├── AI Sprite Generation Workflow.md
│   │   └── ASSET_GENERATION_GUIDE.md
│   │
│   └── client-reference/               # OHW client documentation
│       ├── OHW App Documentation/
│       └── *.md
│
├── engine/                             # ❌ V1: Deprecated
│
├── engine-v2/                          # ⚠️ V2: Reference only (broken)
│   ├── app/
│   │   ├── components/
│   │   │   ├── game/phaser/            # MainScene, PhaserGame, config
│   │   │   ├── journey/                # JourneyMap React component
│   │   │   └── ui/                     # iOSFrame, etc.
│   │   └── data/                       # buildings.ts, milestones.ts
│   └── public/                         # Assets (tiles, buildings, props)
│
├── engine-v3/                          # 🚀 V3: Expo + Pixi.js v8 (native)
│   ├── app.json                        # Expo config (expo-audio, expo-gl)
│   ├── App.tsx                         # ErrorBoundary + JourneyMapNavigator
│   ├── src/
│   │   ├── components/                 # QuarterlyView, navigator, transitions
│   │   ├── game/                       # Pixi renderer, avatar, props, effects
│   │   ├── data/                       # path configs, Supabase hook scaffold
│   │   ├── theme/                      # tokens + seasonal palettes
│   │   └── assets/                     # placeholder sprites/tiles/icons/audio
│   └── scripts/                        # smoke-test, smoke-test-pixi, generate-assets
│
├── features/                           # Feature specifications
│   ├── patient-app/                    # Screens, onboarding, education
│   ├── platform-examples/              # Competitor analysis
│   └── provider-dashboard/             # Provider console specs
│
└── sprite-generator/                   # Standalone sprite generation tool
```

---

## Key Documents (Read These First)

| Priority | Document | Purpose |
|----------|----------|---------|
| 1 | `docs/ORTHOGONAL_CONVERSION_PLAN.md` | **V3 technical spec** - all decisions locked in |
| 2 | `docs/user-journeys/journey_map_design_spec.md` | **UX spec** - 4 zoom levels, node types, gamification |
| 3 | `.droid/phases/overview.md` | **Progress tracker** - current phase status |
| 4 | `docs/figma-exports/design-tokens.md` | **Design system** - colors, typography, spacing |
| 5 | `AGENTS.md` | **Session handoffs** - how to continue work |

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16 |
| UI | React | 19 |
| Game Engine | Phaser | 3.90 |
| Styling | Tailwind CSS | 4 |
| Language | TypeScript | 5 |
| AI Assets | Gemini API | via OpenRouter |
| Mobile | Capacitor | iOS target |

---

## Architecture Overview

### V3 Target: Mario-Style World Map Navigation

```
QUARTERLY VIEW (World Select)
┌──────────────────────────────────────┐
│  [Q1 Cabin]  [Q2 Town]  [Q3 Suburb]  │  ← 4 biome zones
│     🔵          ⚫         ⚫         │  ← Current position dot
└──────────────────────────────────────┘
                    ↓ tap Q1

MONTHLY VIEW (World Map)
┌──────────────────────────────────────┐
│    ○───○───○───○                     │  ← 3-4 week nodes
│   M1  M2  M3  (M4)                   │  ← Paths connect them
│    🔵                                │  ← Position indicator
└──────────────────────────────────────┘
                    ↓ tap M1

WEEKLY VIEW (Level Map)
┌──────────────────────────────────────┐
│  🧑─○─○─○─○─○─○─○─○                  │  ← 8-9 daily nodes
│  ↑                                   │  ← Avatar walks on path
│  Avatar                              │
└──────────────────────────────────────┘
                    ↓ tap node

DAILY VIEW (Mission Objectives)
┌──────────────────────────────────────┐
│  💊 Medication  ✅                    │
│  🍎 Nutrition   ○                    │  ← 4-5 action nodes
│  🏃 Movement    ○                    │  ← Tap → opens tracker
│  🌙 Rest        ○                    │
└──────────────────────────────────────┘
```

---

## For AI Agents

### Starting a New Session
1. Read `AGENTS.md` for recent session context
2. Check `.droid/phases/overview.md` for current phase
3. Review phase-specific checklist in `.droid/phases/`
4. Reference `docs/ORTHOGONAL_CONVERSION_PLAN.md` for decisions

### Ending a Session
1. Update `.droid/phases/` with progress
2. Add learnings to `.droid/context/learnings.md`
3. Update `AGENTS.md` with session summary
4. Note any blockers or next steps

---

## Figma Access

**File:** `DDIpRwZyK7uCHtl2RBXs6Y` (OHW Patient UI)
**Link:** https://www.figma.com/design/DDIpRwZyK7uCHtl2RBXs6Y/OHW-Patient-UI

Design tokens and screen inventory extracted to `docs/figma-exports/`.

---

## License

MIT (code) - Generate your own assets for production use.
