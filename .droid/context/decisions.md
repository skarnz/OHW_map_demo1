# Key Decisions

Architectural and design decisions for OHW Journey Map V3.

---

## Technical Architecture

### Grid System
| Decision | Value | Rationale |
|----------|-------|-----------|
| Tile size | 48x48 pixels | Balance between TinySwords (64x64) and mobile performance |
| Perspective | Orthogonal top-down | Matches TinySwords, simpler than isometric |
| World layout | Scrollable vertical | Phone-width constrained, vertical exploration |

### Scene Structure
| Decision | Value | Rationale |
|----------|-------|-----------|
| Scene count | 4 separate Phaser scenes | Cleaner than single scene with zoom, allows independent loading |
| Transitions | Cloud/fog animation | Masks loading time, feels natural |
| Loading strategy | Per-zone on demand | Fast initial load, acceptable transition delay |

### Navigation
| Decision | Value | Rationale |
|----------|-------|-----------|
| Camera model | Hybrid (Mario + CoC) | Snap-to-node + avatar follow + free pan |
| Path system | Procedural from node list | Simpler than hand-authored, extensible |
| Avatar visibility | Weekly/Daily only | Q/M views show indicator dot, less cluttered |

---

## UX Decisions

### Progression
| Decision | Value | Rationale |
|----------|-------|-----------|
| Unlock model | Time-based (calendar) | Life goes on, no shame for missed days |
| Missed nodes | "Skipped" state (grey) | No catch-up, but path continues |
| Rewards | Hybrid (badges require completion) | Incentive without blocking |

### Feedback
| Decision | Value | Rationale |
|----------|-------|-----------|
| Celebration tiers | Daily < Weekly < Monthly < Quarterly | Bigger rewards for bigger milestones |
| Daily feedback | Points pop + sound + avatar reaction | Quick dopamine hit |
| Weekly feedback | Banner dropdown | Visible progress |
| Monthly/Quarterly | Full confetti celebration | Major achievement |

### Avatar
| Decision | Value | Rationale |
|----------|-------|-----------|
| Movement | 2-4 second walk along path | Like Mario/CoC, satisfying |
| Customization | 3-5 presets V1, full later | Quick to ship, architecture supports expansion |
| Emotions | Time-aware (tired at night) | Natural, no shame emotions |

---

## Art & Assets

### Style
| Decision | Value | Rationale |
|----------|-------|-----------|
| Art style | TinySwords-compatible | Smooth, high-quality pixel art |
| Character size | 192x192 sprites | Matches TinySwords units |
| Tile source | Mix TinySwords + Gemini | TinySwords for base, Gemini for custom |

### Seasons
| Decision | Value | Rationale |
|----------|-------|-----------|
| Seasonal variants | Full 4 seasons | Visual freshness, date-triggered |
| Implementation | Palette swaps | Efficient, same tiles different colors |

---

## App Integration

### Navigation
| Decision | Value | Rationale |
|----------|-------|-----------|
| Tab placement | Center of bottom nav | Most important feature, replaces Progress |
| Progress nesting | Button inside Journey Map | Preserves existing Progress content |

### Data Flow
| Decision | Value | Rationale |
|----------|-------|-----------|
| Node tap behavior | Opens native screen | Integrates with existing trackers |
| State sync | Real-time from app data | Journey Map reflects actual progress |

---

## Scope & Timeline

### V1 Scope
| Decision | Value | Rationale |
|----------|-------|-----------|
| Initial scope | One complete quarter | Prove concept before expanding |
| Timeline | 6-8 weeks | Quality over speed |
| Priority | Done right > done fast | Client preference |

---

## Open Decisions (TBD)

- [ ] Exact tab label for Journey Map ("Journey" vs "Map" vs icon only)
- [ ] Whether to show mini-map in Weekly/Daily views
- [ ] Sound effect library selection
- [ ] Offline behavior specifics
