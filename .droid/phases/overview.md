# Implementation Phases Overview (V3 Revised Plan)

## Status Legend
- ⬜ NOT STARTED
- 🟡 IN PROGRESS  
- ✅ COMPLETE
- ⏸️ BLOCKED

---

## Phases

| # | Phase | Status | Target | Description |
|---|-------|--------|--------|-------------|
| 1 | Foundation + App Integration | ✅ | Week 1-2 | Expo + expo-gl + Pixi.js, Quarterly View, Monthly skeleton, cloud transitions, contracts |
| 2 | Weekly + Daily Scenes | ✅ | Week 2-3 | All 3 Pixi scenes, path rendering, node states, back nav, camera bounds |
| 3 | Avatar + Interactivity | ✅ | Week 3-4 | Procedural avatar (3 anims), camera follow, celebrations, SoundManager + 5 MP3s |
| 4 | Art + Polish | 🟡 | Week 4-5 | Placeholder art done; Gemini-quality biome assets blocked on API key |
| 5 | Full Journey + Testing | 🟡 | Week 5-6 | Path configs, seasonal palettes, error boundaries, data hook, GraphicsPool, Android prebuild -- done. Perf benchmarks on device + visual regression -- pending |

---

## Current Focus

**Phase:** 5 (remaining items: visual regression tests, performance benchmarks on physical device)

**Blockers:**
- Phase 4 Gemini art generation needs OPENROUTER_API_KEY
- Android testing needs physical device or emulator setup
- Performance benchmarks need physical device

---

## What's Done

### Phase 1-2 (Foundation)
- Expo project with expo-gl + pixi.js v8 rendering natively on iOS
- 4-layer navigation: Quarterly (RN) → Monthly → Weekly → Daily (Pixi.js)
- Cloud transitions, gesture handling, scene communication contracts
- DOM shim layer (pixiNativeSetup.ts) for Pixi v8 on React Native

### Phase 3 (Game Feel)
- Procedural avatar with idle/walk/celebrate animations (11-color character)
- Avatar walks along bezier paths between nodes
- Camera follows avatar during walks
- Celebration effect (12-particle burst + points popup)
- SoundManager with 5 synthesized MP3s (native only, web-gated)

### Phase 4 (Art - Partial)
- 42 assets on disk (16 avatar sprites, 9 tiles, 11 node icons, 5 audio, 1 UI placeholder)
- Procedural decorative props (trees, bushes, rocks, flowers, buildings, ponds, benches, lamps)
- Asset manifest with disk existence validation in smoke tests
- All rendering uses procedural Graphics (sprite upgrade path documented in loader.ts)

### Phase 5 (Testing - Partial)
- Path configs: 4/8/12/24-week + custom generation
- Seasonal palettes: 4 seasons x 4 biomes with RGB tint multipliers
- useJourneyData hook wired into navigator (loading/error states, season propagation)
- ErrorBoundary wrapping app with retry UI
- QUARTER_BIOMES centralized in contracts.ts
- 420 tests passing (379 core + 41 Pixi)
- TypeScript clean, web export builds

---

## Remaining Work

| Item | Phase | Blocked? | Notes |
|------|-------|----------|-------|
| Gemini biome art (4 biomes) | 4 | Yes (API key) | Replace Pillow placeholders with TinySwords-quality sprites |
| Wire sprite-based rendering | 4 | No | PIXI.Assets.load + Sprite objects to replace Graphics |
| Visual regression tests | 5 | No | Screenshot comparison framework |
| Performance benchmarks | 5 | Yes (device) | 60fps target on mid-range Android, needs physical device |
| Real Supabase connection | 5 | Yes (backend) | useJourneyData hook ready, needs backend access |

**Completed this session:**
- ~~Performance optimization~~ → GraphicsPool implemented (object pooling for scene rebuild)
- ~~Android build~~ → `expo prebuild --platform android` successful

---

## Test Coverage

| Suite | Assertions | Status |
|-------|-----------|--------|
| Core smoke test | 379 | All pass |
| Pixi module test | 48 | All pass |
| TypeScript | Clean | No errors |
| Web export | Builds | 1460+ modules |
| iOS native | Renders | Monthly scene verified in simulator |

---

## Key Technical Decisions

- Pixi.js v8 + expo-gl over Phaser + WebView (native GL performance)
- Procedural Graphics over sprites for V1 (works everywhere, sprites are upgrade path)
- expo-audio over expo-av (SDK 54 deprecation)
- Custom DOMAdapter + pixiNativeSetup.ts over @expo/browser-polyfill
- QUARTER_BIOMES in contracts.ts as single source of truth
- Seasonal palette tints applied via RGB multipliers in getSeasonalPalette()
