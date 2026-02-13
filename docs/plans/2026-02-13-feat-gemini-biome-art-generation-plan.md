---
title: "feat: Generate Gemini-quality biome art for 4 quarters"
type: feat
date: 2026-02-13
---

# Generate Gemini-Quality Biome Art for All 4 Quarters

## Overview

Replace Pillow-generated placeholder assets with TinySwords-quality art using Gemini via OpenRouter. The existing `engine-v3/scripts/generate-assets.ts` script already has the wiring -- it needs to read the API key from `engine/.env.local` and use a model that actually returns images.

## Problem Statement

All 42 game assets are currently Pillow-generated placeholders (basic shapes, 11-52 colors). The game runs and renders fine with procedural Graphics, but the PNG assets on disk need to be production-quality for when sprite-based rendering is wired in.

## Proposed Solution

1. Update `engine-v3/scripts/generate-assets.ts` to read `OPENROUTER_API_KEY` from `engine/.env.local`
2. Fix the OpenRouter API call format (the existing `sprite-generator/generate.js` has a working pattern)
3. Run generation for all 4 biomes (wilderness, town, suburbs, city) + nodes + avatar frames
4. Validate generated PNGs replace placeholders at correct dimensions

## Technical Considerations

- **Existing wiring:** `sprite-generator/generate.js` successfully generated 13 sprites using `google/gemini-2.0-flash-exp:free` via OpenRouter
- **V3 script:** `engine-v3/scripts/generate-assets.ts` uses `google/gemini-2.5-flash-image-generation` -- need to verify this model exists and returns images
- **API key location:** `engine/.env.local` (gitignored, contains OPENROUTER_API_KEY)
- **Rate limiting:** Script already has 100ms delay between requests
- **Fallback:** Script creates placeholder PNGs if API fails
- **Cost:** ~$0.01-0.04 per image, ~42 images = ~$0.50-$1.70 total

## Acceptance Criteria

- [x] Script reads API key from `engine/.env.local` (not just env var)
- [ ] Script uses a working Gemini model that returns base64 image data
- [ ] All 42 assets regenerated with Gemini art (or best-effort with fallback)
- [ ] Generated PNGs match expected dimensions (48x48 tiles, 48x48 nodes, 48x64 avatar)
- [ ] Smoke test still passes (disk existence validation)
- [ ] No API key committed to git

## MVP

### engine-v3/scripts/generate-assets.ts changes

```typescript
// Read API key from engine/.env.local if not in env
if (!API_KEY) {
  const envPath = path.join(__dirname, '../../engine/.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/OPENROUTER_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
  }
}
```

## References

- Working generator: `sprite-generator/generate.js` (13 sprites generated successfully)
- V3 script: `engine-v3/scripts/generate-assets.ts` (has prompts, output paths, filtering)
- API key: `engine/.env.local`
- Asset manifest: `engine-v3/src/game/assets/manifest.ts`
- Generated output: `sprite-generator/output/sprites/` (proof it works)
