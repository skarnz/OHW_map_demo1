# OHW Journey Map: Orthogonal Conversion Plan

## Status: DRAFT - Discovery Interview Complete (95%)

---

## 1. Core Technical Decisions

### Grid & Tiles
- **Tile size**: 48x48 pixels (orthogonal top-down)
- **Perspective**: Top-down orthogonal (like TinySwords/Mario)
- **World layout**: Scrollable vertical, phone-width constrained

### Scene Architecture
- **4 separate Phaser scenes** for zoom levels (Q/M/W/D)
- **Transition animations**: Cloud/fog overlay to mask loading between scenes
- **Loading strategy**: Per-zone on demand (load current quarter, lazy-load others)

---

## 2. Zoom Level Mapping (Mario-Style)

| Zoom Level | OHW Equivalent | Mario Equivalent | What User Sees |
|------------|---------------|------------------|----------------|
| **Quarterly** | 4 quarters | World Select screen | 4 biome zones as tappable regions, indicator dot for user position |
| **Monthly** | Months in quarter | World Map (horizontal scroll) | Path with 3-4 week "level" nodes, decorative props |
| **Weekly** | Week's tasks | Inside a Level | Winding path with 8-9 daily stops, avatar walks on path |
| **Daily** | Today's tasks | Mission objectives | 4-5 action nodes (medication, nutrition, movement, rest) |

### Avatar Visibility
- **Quarterly/Monthly**: Position indicator (colored dot/icon) - no full avatar
- **Weekly/Daily**: Full avatar visible, walks along path

---

## 3. Environment & Biomes

### Quarter Themes (Nature → City Progression)
| Quarter | Environment | Visual Elements | Season Variants |
|---------|-------------|-----------------|-----------------|
| Q1: Foundation | Wilderness/Cabin | Log cabin, lake, dense forest, trails | Spring/Summer/Fall/Winter |
| Q2: Momentum | Suburban/Town | Community center, fountain, park, bikes | Spring/Summer/Fall/Winter |
| Q3: Optimization | Urban Transition | Mixed residential, gardens, small buildings | Spring/Summer/Fall/Winter |
| Q4: Sustainability | Thriving City | Glowing skyline, modern buildings | Spring/Summer/Fall/Winter |

### Biome Transitions
- **Between quarters**: Scene change handles it (separate Phaser scenes)
- **Edge of map**: Gradient blend zone + bridge/gate landmark
- **Week to week**: Gradient blend for visual continuity
- **Day to day within week**: Smooth scrolling, no hard boundaries

### Seasonal System
- **Full 4-season variants** for entire map
- **Date-triggered**: Seasons change based on real calendar dates
- **Assets needed**: Each biome × 4 seasons = 16 tile palette variants

---

## 4. Path & Navigation

### Path Style
- **Weekly/Daily views**: Winding dirt road (board game style)
- **Monthly view**: Paths connecting week nodes (like Mario world map)
- **Quarterly view**: No winding path - zones are tappable regions

### Path Data Structure
- **Procedural generation** from node list (auto-generates curved path)
- **Architecture supports**: Hand-tuned control points for fine-tuning later

### Camera/Navigation (Clash of Clans + Mario Hybrid)
- **Snap-to-milestone**: Tap a node, camera smoothly pans to it
- **Avatar follows**: Camera tracks avatar as it walks to destination
- **Free pan**: User can drag to explore (within bounds)
- **Zoom gestures**: Pinch to zoom triggers scene transitions at thresholds

---

## 5. Node System

### Node Placement
- **Fixed positions** on snake/spiral path (linear progression)
- **Architecture supports**: Small offshoots for optional tasks later

### Node States
| State | Visual | Meaning |
|-------|--------|---------|
| **Locked** | Grey fill, lock icon | Future - not yet accessible |
| **Unlocked** | Full color, no lock | Ready to complete |
| **In Progress** | Glowing outline, pulsing | Currently active |
| **Completed** | Green checkmark | Done |
| **Skipped** | Grey, no points | Missed (no shame) |

### Progression Rules
- **Time-based unlocking**: Calendar date unlocks access (life goes on)
- **Hybrid rewards**: Full rewards/badges require completion
- **No catch-up**: Can't complete yesterday's nodes today
- **No shame**: Skipped nodes are grey but path continues

### Branching Paths
- **Optional side paths**: Bonus education modules
- **Choice-based branches**: User preferences (strength vs cardio path)
- **Architecture supports**: Hidden paths for streak achievements later

---

## 6. Avatar System

### Movement
- **Fast walk/run animation**: 2-4 seconds along path between nodes
- **Path-constrained**: Avatar walks on path, not free roaming

### Customization (Phased)
- **V1**: 3-5 preset characters to choose at onboarding
- **Architecture supports**: Full customization (skin, hair, outfit)
- **Future**: Unlockable outfits/accessories as rewards

### Reactions & Emotions
- **Triggers**: Node completion, streak milestones, entering new zones
- **Time-aware**: Tired at night, awake in morning
- **No shame emotions**: Never sad about missed goals

### Animation Set (Target: 6-8 core + variants for 60fps mobile)
| Animation | Frames | Usage |
|-----------|--------|-------|
| Idle | 6-8 | Default standing |
| Walk North | 6 | Walking up |
| Walk South | 6 | Walking down |
| Walk East | 6 | Walking right |
| Walk West | 6 | Walking left |
| Celebrate | 8-10 | Node completion |
| Wave | 6 | Greeting/zone entry |
| Tired | 4 | Night time |
| Excited | 6 | Big achievements |

---

## 7. Feedback & Dopamine System

### Tiered Celebration Hierarchy
| Level | Trigger | Feedback |
|-------|---------|----------|
| **Daily node** | Complete task | Points pop-up + sound + avatar reaction + progress bar fill |
| **Weekly milestone** | Complete week | Banner dropdown + bigger sound + extended celebration |
| **Monthly milestone** | Complete month | Confetti + fanfare + badge unlock + avatar dance |
| **Quarterly milestone** | Complete quarter | Full celebration + zone unlock animation + achievement |

### Progress Indicators
- **Daily view**: Progress bar for today's tasks
- **Weekly view**: Progress banner/dropdown showing week completion %
- **Top bar (always visible)**: Streak counter (🔥) + Points (💎)

---

## 8. Asset Pipeline

### Generation Workflow
- **Pre-generated at build**: All core assets ship with app
- **On-demand for customization**: User-specific avatar variants via API
- **Seasonal assets**: Pre-generated, swapped based on date

### Style Consistency (TinySwords Match)
1. **Strict style prompts** for Gemini with post-processing normalization
2. **Fine-tune/train** on TinySwords examples for consistency
3. **Human curation** of generated outputs for quality control

### Asset Sources
| Asset Type | Source |
|------------|--------|
| Base tiles (grass, dirt, water) | TinySwords or Gemini-generated |
| Generic props (trees, benches, rocks) | TinySwords asset pack |
| Health-themed items | Gemini-generated (custom) |
| Avatar characters | Gemini-generated (TinySwords style, 192x192) |
| Milestone buildings | Gemini-generated (custom) |
| Seasonal variants | Gemini-generated |

### Gemini Prompt Strategy
```
Create a smooth, high-resolution orthogonal top-down game sprite:
- Style: Pixelfrog/Tiny Swords cartoon pixel art (NOT harsh pixels)
- Perspective: Top-down orthogonal, 48x48 tile grid
- Size: [specific dimensions based on asset type]
- Theme: [health/wellness context]
- Colors: Soft gradients, warm wellness palette, anti-aliased edges
- Animation: [X frames at 10fps if animated]
- Background: Transparent PNG
```

### Gemini API Configuration (Nano Banana Patterns)

**Model Selection:**
| Model | Use Case | Resolution |
|-------|----------|------------|
| `gemini-2.5-flash-image` | Fast iterations, drafts | 1K |
| `gemini-3-pro-image-preview` | Final quality assets | 2K |

**Provider Options:**
```typescript
// For sprite generation (images only, saves tokens)
providerOptions: {
  google: {
    responseModalities: ['IMAGE'],
    imageConfig: {
      aspectRatio: '1:1',  // Best for sprites (lowest cost)
      imageSize: '2K'      // Pro only, use 1K for Flash
    }
  }
}
```

**Conversational Editing (for iterative refinement):**
```typescript
// Keep message history to edit existing sprites
const result = await generateText({
  model: google('gemini-3-pro-image-preview'),
  messages: [
    ...previousMessages,
    {
      role: 'user',
      content: [
        ...existingImageParts,  // Include image to edit
        { text: 'Make the cabin roof more orange to match our accent color' }
      ]
    }
  ],
  providerOptions: { google: { responseModalities: ['IMAGE'] } }
})
```

**Storage Strategy:**
- **Development:** Local `/public/generated/` directory
- **Production:** Vercel Blob or S3/R2
- **Never use base64 data URLs** in production (performance killer)

**Rate Limiting (Required):**
```typescript
// Upstash Redis for production
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'ohw-sprites'
})
```

**Cost Optimization:**
1. Use Flash for drafts (~$0.01/image), Pro for finals only (~$0.04/image)
2. 1:1 aspect ratio = fewest tokens
3. `responseModalities: ['IMAGE']` skips text generation
4. Cache prompts with hash-based deduplication
5. Pre-generate all core assets at build time

**Error Handling:**
- `429` = Rate limited → Exponential backoff
- `400` = Content policy → Modify prompt
- `401` = Invalid API key → Check `.env`

---

## 9. App Integration

### Navigation Structure
- **Journey Map**: Center tab in bottom navigation
- **Other tabs**: Dashboard, Profile, etc. (existing app screens)
- **Node tap behavior**: Opens corresponding native screen (food logger, medication tracker, etc.)

### Data Flow
- Completing actions on native screens → Updates node state on Journey Map
- Journey Map reflects real-time progress from app data
- Tapping completed nodes → Shows summary or edit option

---

## 10. Technical Specifications

### Performance Targets
- **Frame rate**: 60fps on mobile
- **Initial load**: < 3 seconds
- **Scene transition**: < 1 second (masked by cloud animation)

### Phaser Configuration
- **Renderer**: WebGL with canvas fallback
- **Tile batching**: Enabled for performance
- **Asset format**: PNG with transparency
- **Sprite size**: 48x48 base tiles, 192x192 characters

### Mobile Considerations
- **Touch controls**: Tap to select, drag to pan, pinch to zoom
- **Hit areas**: Minimum 48x48 for tap targets
- **Battery**: Throttle to 30fps when backgrounded

---

## 11. Design System (from Figma)

**Source:** `https://www.figma.com/design/DDIpRwZyK7uCHtl2RBXs6Y/OHW-Patient-UI`

### Color Palette (Verified from Figma)
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F7F7F7` | Screen background |
| Card Background | `#FFFFFF` | Cards, panels |
| Text Primary | `#0A0A0A` | Headers, body text |
| Text Secondary | `#8C8C8C` | Captions, labels, inactive |
| Accent Blue | `#0A84FF` | Progress bars (carbs) |
| Accent Red | `#D21737` | Progress bars (protein) |
| Accent Yellow | `#D2BD17` | Progress bars (fats) |
| Accent Gold | `#FFB200` | Points, rewards |
| Accent Teal | `#00B3A7` | Rank badge |
| Progress Track | `#F4F4F4` | Empty progress bar |
| Border Light | `rgba(10,10,10,0.07)` | Input borders |

### Typography
| Style | Size | Weight |
|-------|------|--------|
| H1 (Screen title) | 26px | Bold |
| H2 (Section header) | 18px | Semibold |
| Body | 16px | Regular |
| Caption | 14px | Regular |
| Tab label | 13px | Medium |

### Spacing
| Token | Value |
|-------|-------|
| Screen padding | 20px horizontal |
| Card padding | 18-20px |
| Section gap | 16-24px |
| Card radius | 16px |
| Button radius | 12px |

### Bottom Navigation (Confirmed)
- **Current 5 tabs:** Home, Log Meal, Fitness, Education, Progress
- **Journey Map placement:** Replaces "Progress" and moves to CENTER position
- **Progress page:** Nested inside Journey Map (accessible via button)
- **Active state:** Black `#0A0A0A` icon + text
- **Inactive state:** Grey `#8C8C8C` icon + text
- **Icon size:** 28x28px
- **Label size:** 13px

**New nav structure:**
```
Home | Log Meal | 🗺️ Journey | Fitness | Education
```

### UI Patterns
- White cards with subtle shadow on gradient background
- Orange progress bars with grey track
- Circular progress rings for daily stats
- Line-style icons (not filled)
- Floating action button (bottom right, black circle with white +)

---

## 12. Open Questions (To Be Resolved)

- [x] Exact node counts per view (confirmed in journey_map_design_spec.md)
- [x] Sound design: Simple effects V1, architecture for more
- [x] Offline support: Requires connection, graceful failure
- [x] Journey Map tab placement: CENTER of bottom nav, replaces Progress
- [ ] Analytics/tracking for engagement
- [ ] Accessibility considerations
- [ ] Exact tab label ("Journey" vs "Map" vs icon only)

### Related Documentation
- Figma design tokens: `docs/figma-exports/design-tokens.md`
- App screens inventory: `docs/figma-exports/screens-inventory.md`
- Phase tracking: `.droid/phases/overview.md`

---

## 13. Implementation Phases

### Phase 1: Skeleton (Week 1-2)
**Goal:** Basic orthogonal engine with scene structure

- [ ] Create `/engine-v3` directory with fresh Next.js + Phaser setup
- [ ] Implement 48x48 orthogonal tile grid renderer
- [ ] Create 4 Phaser scene classes (Quarterly, Monthly, Weekly, Daily)
- [ ] Implement cloud transition animation between scenes
- [ ] Basic camera controls (pan, zoom bounds)
- [ ] Placeholder colored rectangles for tiles/nodes

**Deliverable:** Can navigate between 4 scenes with transitions

### Phase 2: Q1 Proof of Concept (Week 3-4)
**Goal:** One complete quarter as functional prototype

- [ ] Design Q1 "Foundation/Cabin" zone layout
- [ ] Implement procedural path generation between nodes
- [ ] Create node data structure with states (locked/unlocked/complete/skipped)
- [ ] Monthly view: 3 month nodes with paths
- [ ] Weekly view: Week 1 with 8-9 daily nodes
- [ ] Daily view: 4-5 action nodes for one day
- [ ] Basic node tap → scene transition logic

**Deliverable:** Can navigate Q1 → Month 1 → Week 1 → Day 1

### Phase 3: Avatar & Movement (Week 4-5)
**Goal:** Character walking along paths

- [ ] Generate 3-5 avatar presets via Gemini (192x192, TinySwords style)
- [ ] Implement avatar sprite with walk animations (N/S/E/W)
- [ ] Path-following movement system (2-4 second walks)
- [ ] Camera follow behavior during movement
- [ ] Snap-to-node after movement completes
- [ ] Avatar visibility rules (hidden in Q/M views, visible in W/D)

**Deliverable:** Avatar walks between nodes in Weekly/Daily views

### Phase 4: Assets & Art (Week 5-6)
**Goal:** TinySwords-quality visuals

- [ ] Create `assets.json` metadata file for all sprites
- [ ] Generate Q1 biome tiles via Gemini (grass, dirt, water, paths)
- [ ] Generate Q1 milestone buildings (cabin, lake, forest props)
- [ ] Import TinySwords props for generic items (trees, rocks, benches)
- [ ] Implement tile palette system for seasonal variants
- [ ] Add decorative props along paths

**Deliverable:** Q1 looks polished with consistent art style

### Phase 5: Feedback & Polish (Week 6-7)
**Goal:** Dopamine system and celebrations

- [ ] Points pop-up animation on node completion
- [ ] Progress bar fill animations
- [ ] Avatar celebration reactions
- [ ] Sound effects (blips, chimes, celebration jingle)
- [ ] Weekly banner dropdown
- [ ] Monthly/Quarterly confetti celebration
- [ ] Streak counter UI (top bar)
- [ ] Node state visual transitions

**Deliverable:** Completing nodes feels rewarding

### Phase 6: Remaining Quarters (Week 7-8)
**Goal:** Full 4-quarter journey

- [ ] Generate Q2 "Town" biome assets
- [ ] Generate Q3 "Suburb" biome assets
- [ ] Generate Q4 "City" biome assets
- [ ] Implement all months/weeks/days for Q2-Q4
- [ ] Biome transition landmarks (bridges/gates)
- [ ] Seasonal system (date-triggered palette swaps)

**Deliverable:** Complete 12-month journey map

### Phase 7: App Integration (Week 8+)
**Goal:** Connect to real app

- [ ] Bottom navigation integration (Journey Map tab)
- [ ] Node tap → native screen navigation
- [ ] Real user progress data flow
- [ ] Sync completed actions from other screens
- [ ] Capacitor/iOS testing
- [ ] Performance optimization for mobile

**Deliverable:** Journey Map works as center tab in production app

---

## 14. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Gemini output inconsistency | Strict prompts + fine-tuning + human curation pipeline |
| Performance on mobile | 48x48 tiles, aggressive batching, lazy loading, 30fps background |
| Scope creep | Stick to one quarter first, prove it works |
| Art style mismatch with app | Use Figma design tokens, match orange accent |
| Complex path generation | Start with hand-placed nodes, procedural curves only |

---

## 15. Success Criteria

### MVP (Phase 1-2)
- [ ] 4 scenes load and transition smoothly
- [ ] Q1 navigable from quarter → month → week → day
- [ ] Nodes are tappable and show state changes

### Beta (Phase 3-5)
- [ ] Avatar walks along paths
- [ ] Art style matches TinySwords quality
- [ ] Feedback system triggers dopamine

### Production (Phase 6-7)
- [ ] All 4 quarters complete
- [ ] Integrates with existing app
- [ ] 60fps on iPhone 12+
- [ ] Seasonal themes work

---

*Document created: 2026-02-03*
*Last updated: 2026-02-04 - Discovery interview complete, Figma design system extracted*
