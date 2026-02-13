# Phase 1: Skeleton

**Status:** NOT STARTED
**Target:** Week 1-2
**Goal:** Basic orthogonal engine with scene structure

---

## Checklist

### Setup
- [ ] Create `/engine-v3` directory
- [ ] Initialize Next.js 16 + React 19 project
- [ ] Install Phaser 3.90
- [ ] Configure Tailwind CSS 4
- [ ] Set up TypeScript strict mode
- [ ] Create basic folder structure

### Grid System
- [ ] Define 48x48 tile constants
- [ ] Create orthogonal coordinate converter (grid ↔ screen)
- [ ] Implement basic tile renderer
- [ ] Test with placeholder colored rectangles

### Scene Architecture
- [ ] Create `QuarterlyScene.ts`
- [ ] Create `MonthlyScene.ts`
- [ ] Create `WeeklyScene.ts`
- [ ] Create `DailyScene.ts`
- [ ] Implement scene manager/router

### Transitions
- [ ] Create cloud overlay sprite/animation
- [ ] Implement fade-in/fade-out transition
- [ ] Test scene switching with transitions
- [ ] Handle loading state during transition

### Camera
- [ ] Set up camera bounds per scene
- [ ] Implement pan controls (drag)
- [ ] Implement zoom bounds
- [ ] Test on mobile viewport (375x812)

### React Integration
- [ ] Create `JourneyMapV3.tsx` wrapper component
- [ ] Implement Phaser game initialization
- [ ] Set up React ↔ Phaser communication pattern
- [ ] Avoid V2 re-render loop mistakes (use refs where appropriate)

---

## Deliverable

**Can navigate between 4 scenes with transitions**

User can:
1. See placeholder Quarterly view
2. Tap to enter Monthly view (with cloud transition)
3. Tap to enter Weekly view
4. Tap to enter Daily view
5. Navigate back up the hierarchy

---

## Files to Create

```
engine-v3/
├── app/
│   ├── page.tsx                    # Main entry
│   ├── globals.css                 # Tailwind imports
│   ├── components/
│   │   ├── journey/
│   │   │   └── JourneyMapV3.tsx    # React wrapper
│   │   └── game/
│   │       ├── types.ts            # Grid types, constants
│   │       ├── scenes/
│   │       │   ├── QuarterlyScene.ts
│   │       │   ├── MonthlyScene.ts
│   │       │   ├── WeeklyScene.ts
│   │       │   └── DailyScene.ts
│   │       ├── SceneManager.ts     # Scene transitions
│   │       ├── GridRenderer.ts     # Tile rendering
│   │       └── gameConfig.ts       # Phaser config
│   └── data/
│       └── journey-structure.ts    # Q/M/W/D node definitions
├── public/
│   └── placeholder/               # Temp colored tiles
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Technical Notes

### Avoiding V2 Mistakes
1. Use `useRef` for values that don't need re-render
2. Memoize grid generation with stable dependencies
3. No `console.log` in hot paths
4. Keep Phaser state in Phaser, React state in React

### Scene Communication
```typescript
// Pattern: React → Phaser
const sceneRef = useRef<QuarterlyScene>(null);
sceneRef.current?.navigateToMonth(1);

// Pattern: Phaser → React
scene.events.emit('monthSelected', monthId);
// React listens via scene.events.on()
```

---

## Blockers

None currently.

---

## Notes

_Add implementation notes here as work progresses_
