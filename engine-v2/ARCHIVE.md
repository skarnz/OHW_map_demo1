# Engine V2 (Phaser 3 + Next.js, Clean Fork) -- ARCHIVED

> **Status:** Deprecated. Superseded by `engine-v3/` (Expo + Pixi.js v8 + expo-gl).

## What This Was

A clean extraction of the Pogicity engine, stripped down for OHW. This was the "start fresh" attempt after V1's modifications got tangled with the original city-builder code.

- **Framework:** Next.js 16 + Phaser 3.90 (same as V1)
- **Rendering:** Isometric 2:1 (same as V1)
- **Dates:** Jan 23, 2026 (single session, ~2 hours)
- **Why it was abandoned:** Carried the same fundamental problems as V1 (React-Phaser bridge complexity, isometric rendering overhead, WebView dependency for React Native)

## What's In Here

| Path | Purpose |
|------|---------|
| `app/` | Next.js app directory (page, layout, components, data, services, utils) |
| `app/components/ui/` | Full UI toolkit from Pogicity (AssetGeneratorModal, LoadWindow, Modal, MusicPlayer, PromptModal, ToolWindow) |
| `app/services/` | Gemini API service wrappers |
| `public/` | Pogicity assets (tiles, characters, props, buildings) |
| `OHW_ADAPTATION_GUIDE.md` | Step-by-step guide for converting Pogicity to OHW |
| `README.md` | "Extracted from Pogicity" readme |
| `.env.example` | Template for OpenRouter API key |

## What We Learned (carried into V3)

### The OHW Adaptation Guide Was Valuable
`OHW_ADAPTATION_GUIDE.md` documented the mental model for converting a city-builder into a health journey. Key insights:
- Remove build tools (journey is auto-generated, not player-built)
- Buildings = milestone achievements (not player-placed structures)
- Path = health progress (not roads the player draws)
- Character = user avatar (not a builder unit)

### UI Toolkit Overreach
V2 carried Pogicity's full UI toolkit (asset generator, music player, load/save windows). This taught us to **start minimal** -- V3 has zero UI chrome beyond the journey itself.

### The Isometric Decision Was Wrong
Cloning the full Pogicity isometric engine twice (V1 mods, V2 clean fork) proved the approach was fundamentally too complex for a mobile health app. The V3 review (DHH/Kieran/Simplicity reviewers) confirmed: orthogonal top-down with Pixi.js is simpler, faster, and native-ready.

### .env Pattern
The `.env.example` / `.env.local` pattern for the OpenRouter API key was carried forward to all subsequent engines. V3's `generate-assets.ts` reads from `engine/.env.local` as a fallback.

## Why V2 Exists Separately from V1

V1 = modifying Pogicity in-place (messy diffs, hard to reason about).
V2 = clean extraction with an adaptation guide (cleaner, but same architecture).
V3 = ground-up rewrite with a different rendering stack.

The progression V1 -> V2 -> V3 represents narrowing in on the right architecture:
1. V1: "Can we adapt this city builder?" -- Yes, but the code is tangled.
2. V2: "Can we extract it cleanly?" -- Yes, but isometric + Phaser + WebView is wrong for mobile.
3. V3: "What's the right stack?" -- Expo + Pixi.js + expo-gl, orthogonal, native rendering.
