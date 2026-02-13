# Project Learnings

Accumulated learnings from working on OHW Journey Map.

---

## Technical Learnings

### React + Phaser Integration (V2)
- **Problem:** Infinite re-render loops from `getAllMilestones()` creating new array every render
- **Solution:** Wrap in `useMemo(() => getAllMilestones(), [])`

- **Problem:** Zoom callback loop - `handleZoomChange` → `setZoom` → re-render → Phaser emits again
- **Solution:** Use `useRef` for zoom value instead of state when updates don't need visual re-render

- **Problem:** Grid state loop - `useState + useEffect` pattern caused setState loops
- **Solution:** Use pure `useMemo` for derived state like grid generation

### Phaser Performance
- Remove `console.log` from hot paths (grid generation, render loops)
- Use `batchSize: 2048` for better sprite batching
- Set `maxLights: 0` to disable unused lighting system
- Target 60fps, min 30fps for mobile

### Asset Generation with Gemini (Nano Banana Patterns)

**Model Selection:**
- `gemini-2.5-flash-image` - Fast iterations, drafts (~1290 tokens/image)
- `gemini-3-pro-image-preview` - Quality output, 2K resolution
- Use Flash for iteration, Pro for final assets

**Provider Options:**
```typescript
providerOptions: {
  google: {
    responseModalities: ['IMAGE'],  // Save tokens, images only
    imageConfig: {
      aspectRatio: '1:1',  // Lowest cost for sprites
      imageSize: '2K'      // Pro only
    }
  }
}
```

**Conversational Editing (for refinement):**
```typescript
// Keep conversation history for iterative edits
const result = await generateText({
  model: google('gemini-3-pro-image-preview'),
  messages: [...history, {
    role: 'user',
    content: [...imageParts, {text: 'Make the colors warmer'}]
  }],
  providerOptions: { google: { responseModalities: ['IMAGE'] } }
})
```

**Storage Recommendations:**
- Vercel Blob for Vercel deployments
- S3/R2 for universal deployments
- Never use base64 data URLs in production

**Rate Limiting (Upstash Redis):**
```typescript
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'ohw-sprites'
})
```

**Cost Optimization:**
- Use 1:1 aspect ratio (fewest tokens)
- Set `responseModalities: ['IMAGE']` to skip text
- Cache similar prompts with deduplication
- Flash for drafts, Pro for finals only

**TinySwords Reference:**
- Character sprites: 192x192
- Tiles: 64x64 (we use 48x48)
- Style: Smooth, clean edges, minimal anti-aliasing

---

## Design Learnings

### From Figma Analysis
- Font: SF Pro (Bold, Semibold, Medium weights)
- Primary text: `#0A0A0A`
- Secondary text: `#8C8C8C`
- Card shadow uses orange-tinted rgba values
- Border radius: 30px for cards, 100px for pills/buttons

### Navigation Pattern
- Journey Map replaces "Progress" tab, moves to CENTER
- Progress content nests inside Journey Map
- Bottom nav has 5 tabs, icons 28x28px, labels 13px

### Journey Map UX (from docs)
- 4 zoom levels: Quarterly → Monthly → Weekly → Daily
- Mario-style world map navigation (tap node, avatar walks)
- Time-based progression (calendar unlocks, no catch-up)
- Tiered dopamine feedback system

---

## Process Learnings

### File Organization
- Keep reference images in `docs/reference-images/`
- Figma exports in `docs/figma-exports/`
- Agent context in `.droid/context/`
- Phase tracking in `.droid/phases/`

### Figma MCP Usage
- `get_metadata` for structure overview (node IDs, names)
- `get_screenshot` for visual reference
- `get_design_context` for full code generation
- `get_variable_defs` often returns empty (design tokens not defined as variables)

### Session Handoffs
- Update `AGENTS.md` at end of session
- Keep `ORTHOGONAL_CONVERSION_PLAN.md` as source of truth
- Use `.droid/phases/` to track implementation progress
