---
title: "feat: Visual regression test harness"
type: feat
date: 2026-02-13
---

# Visual Regression Test Harness

## Overview

Add screenshot-based visual regression testing so that scene rendering changes are caught before they ship. Since the game renders via WebGL (expo-gl), we need to capture the GL framebuffer, not DOM screenshots.

## Problem Statement

Currently there are no visual tests. The smoke tests verify data structures and module APIs but not rendered output. A change to node colors, path rendering, or biome palettes would pass all tests but visually break the game.

## Proposed Solution

Use the web export (`npx expo export --platform web`) + Playwright to capture screenshots of each scene, then compare against baseline images using pixel diffing.

1. Export web build
2. Serve static dist with a simple HTTP server
3. Playwright navigates to each scene state (quarterly, monthly, weekly, daily)
4. Capture screenshots, compare against `__snapshots__/` baselines
5. Report pixel diff percentage; fail if > threshold

## Technical Considerations

- **Web only:** GL framebuffer capture on native requires device/simulator; web is CI-friendly
- **Deterministic rendering:** Pixi.js WebGL output should be deterministic for same input
- **Playwright:** Already available via npm, headless Chrome
- **Threshold:** Allow small anti-aliasing differences (< 1% pixel diff)
- **Baselines:** Store in `engine-v3/__snapshots__/`, gitignored initially until art is finalized

## Acceptance Criteria

- [ ] Script builds web export and serves it
- [ ] Playwright captures screenshots of quarterly, monthly, weekly, daily views
- [ ] Pixel diff comparison against baseline images
- [ ] Fails if diff exceeds threshold (configurable, default 1%)
- [ ] Can update baselines with `--update` flag
- [ ] Runs in CI (no GPU required -- headless Chrome WebGL)

## References

- Web export: `npx expo export --platform web` -> `engine-v3/dist/`
- Existing smoke tests: `engine-v3/scripts/smoke-test.ts`
- Scene navigation: `engine-v3/src/components/JourneyMapNavigator.tsx`
