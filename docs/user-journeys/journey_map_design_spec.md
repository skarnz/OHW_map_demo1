updated document with all three changes applied throughout (Provider Check-in, Weigh-in/Metrics, and Medication Review moved to **weekly**):

---

# OHW Health App: Journey Map Design Guide

## Overview

This guide provides design specifications for the **Journey Map screen** — the center tab on the home navigation. It's a single, interactive map that users can zoom in/out of to see their progress at four time scales: Quarterly, Monthly, Weekly, and Daily. All nodes on the map are tappable and link to relevant tracking features elsewhere in the app.

---

## Visual Theme: Nature → City Health Journey

### Environment Progression

| Quarter | Environment | Visual Elements |
|---------|-------------|-----------------|
| Q1: Foundation | Wilderness/Cabin | Log cabin, lake, rowboat, dense forest, trails |
| Q2: Momentum | Suburban/Town | Community center, fountain, park benches, bikes, scooters |
| Q3: Optimization | Urban Transition | Mixed residential, garden beds, solar panels, small buildings |
| Q4: Sustainability | Thriving City | Glowing skyline, modern buildings, healthy urban life |

### Color Palette
- Primary: Teal, blue, green gradients
- Accent: Warm glows for unlocked nodes, grey for locked
- Path: Blue winding road connecting all nodes

### Core Visual Elements
- **Winding path/road** through each view
- **Floating circular nodes** (isometric style) along the path
- **Lock icons** on incomplete/future nodes
- **Checkmarks** on completed nodes
- **Progress bars** connecting nodes
- **Avatar** walking the path (user's character)
- **Decorative elements**: Trees, benches, bikes, plants, street lamps

---

## How the Views Work

The Journey Map has **4 zoom levels**. Users can pinch/zoom or tap nodes to navigate between them:

| View | What It Shows | Path Scope | Navigation |
|------|---------------|------------|------------|
| **Quarterly** | 4 major milestones (Q1-Q4) | Full 12-month journey | Tap quarter → Monthly |
| **Monthly** | 3-4 nodes for that month | One month | Tap month → Weekly |
| **Weekly** | 8-9 nodes for that week | One week | Tap week → Daily |
| **Daily** | 4-5 nodes for today | Today's tasks | Tap node → Opens feature |

---

## Gamification System

### Top Bar Elements (Visible On All Views)

| Element | Position | Display |
|---------|----------|---------|
| 🔥 Streak | Top right | "7" with flame icon |
| 💎 Points | Top right | "300" with gem icon |
| View toggle | Top left | Dropdown or tabs: Q / M / W / D |

### Streak System
- **Daily login streak**: Increments when user completes all daily nodes
- Visual: Fire icon + number
- Bonus points at milestones: 7-day, 30-day, 90-day

### Points System
| Action | Points |
|--------|--------|
| Complete daily node | 10 pts |
| Complete weekly milestone | 50 pts |
| Complete monthly milestone | 100 pts |
| Complete quarterly milestone | 500 pts |

### Badges
- Unlocked at key milestones
- Examples: "First Week Complete," "30-Day Streak," "Q1 Graduate"
- Viewable in Progress screen (separate from Journey Map)

---

## Node States (All Views)

| State | Visual Treatment | Meaning |
|-------|------------------|---------|
| **Locked** | Grey fill, lock icon overlay | Not yet accessible |
| **Unlocked** | Full color, no lock | Ready to complete |
| **In Progress** | Glowing outline, pulsing | Currently active |
| **Completed** | Green checkmark overlay | Done |

---

## Quarterly View (Zoomed Out)

**Purpose**: Show the full 12-month journey with 4 major phase milestones

**Visual Reference**: The Mission Journey image — 4 floating island nodes connected by winding blue path, nature→city progression

### Nodes (4 Total)

| Node | Name | Months | Theme | Visual | Status Display |
|------|------|--------|-------|--------|----------------|
| 1 | **Foundation** | 1-3 | Setting intentions, assessing habits, creating plans | Cabin on lake, forest | Progress bar with 3 checkmarks (1 per month) |
| 2 | **Momentum** | 4-6 | Nutrition focus, hunger cues, metabolic health | Town with community center, fountain | Locked/Unlocked/Complete |
| 3 | **Optimization** | 7-9 | Overcoming plateaus, stress, body composition | Suburban with gardens, mixed buildings | Locked/Unlocked/Complete |
| 4 | **Sustainability** | 10-12 | Long-term habits, celebration, maintenance | Glowing city skyline | Locked/Unlocked/Complete |

### Progress Indicator Per Node
- 3 small circles connected by line (one per month)
- Grey = incomplete, Green checkmark = complete, Lock = future

### Interaction
- Tap a quarter node → zooms into Monthly View for that quarter
- Avatar positioned at current quarter

---

## Monthly View (Zoomed In One Level)

**Purpose**: Show the current month's education milestones (major touchpoints now happen weekly)

**Visual**: Path winds through that quarter's environment (e.g., Q1 = forest area around cabin)

### Nodes Per Month (3-4)

| # | Node | Icon | Description | Links To |
|---|------|------|-------------|----------|
| 1 | **Deep Education Module** | 🎓 Graduation cap | Comprehensive learning (20-30 min) | Learning library module |
| 2 | **Monthly Goal Review** | 🎯 Target | Big-picture goal check | Goal summary screen |
| 3 | **Monthly Reflection** | 📔 Journal | Month-level wins, challenges, patterns | Reflection prompts screen |
| 4 | **Monthly Milestone** | 🏆 Trophy | Points bonus, badge unlock | Triggers celebration animation |

### Monthly Education Content By Quarter

| Quarter | Month | Deep Education Topic |
|---------|-------|---------------------|
| Q1 | 1 | Personalized Weight Loss Plan Review |
| Q1 | 2 | Early Challenges & AI Guidance |
| Q1 | 3 | Habit Stacking Mastery |
| Q2 | 4 | Macronutrient Balance Review |
| Q2 | 5 | Alcohol Moderation Strategies |
| Q2 | 6 | Intermittent Fasting Deep Dive |
| Q3 | 7 | Psychological Effects of Fasting |
| Q3 | 8 | Stress, Cortisol & Weight Loss |
| Q3 | 9 | Body Composition: Fat vs. Muscle |
| Q4 | 10 | Building Lasting Habits |
| Q4 | 11 | Utilizing Support Groups & Resources |
| Q4 | 12 | Full Journey Review & Maintenance Planning |

### Interaction
- Tap a week section → zooms into Weekly View
- Tap any node → opens linked screen
- Swipe left/right to view other months in quarter

---

## Weekly View (Zoomed In Two Levels)

**Purpose**: Show weekly milestones including provider check-in, weigh-in, medication review, education, and goal check

**Visual**: Closer view of path, 8-9 nodes visible, decorative elements (benches, bikes, plants)

### Nodes Per Week (8-9)

| # | Node | Icon | Description | Links To |
|---|------|------|-------------|----------|
| 1 | **Provider Check-In** | 📋 Clipboard | Weekly check-in with care team (async or scheduled) | Messaging/scheduling screen |
| 2 | **Weigh-In & Metrics** | ⚖️ Scale | Weekly body composition check | Weight log screen, Withings sync |
| 3 | **Medication Review** | 💊 Pill bottle | Weekly dose check, side effects, adjustments | Medication tracker screen |
| 4 | **Weekly Goal Check** | 🎯 Target | Review SMART goal progress for the week | Goal progress summary screen |
| 5 | **Nutrition Summary** | 📊 Chart | Week's calorie/macro averages | Nutrition breakdown screen |
| 6 | **Fitness Summary** | 🏋️ Dumbbell | Total workouts, steps, active minutes | Activity log screen |
| 7 | **Education Module** | 📚 Book / 💡 Lightbulb | Bite-sized learning (5-10 min) | Learning library module |
| 8 | **Reflection** | 📝 Notes | Mood/stress patterns, wins & challenges | Reflection prompts screen |
| 9 | **Weekly Milestone** | ⭐ Star | Celebrate completing the week | Triggers badge + points |

### Weekly Education Content By Quarter

| Quarter | Weekly Module Topics |
|---------|---------------------|
| Q1: Foundation | Defining Your Why & Goals, Understanding Starting Point, Tailoring Strategies to Lifestyle, Identifying Barriers |
| Q2: Momentum | Balanced Meals & Sustainable Swaps, Hunger/Fullness Cues, Fasting Basics & Metabolism, Nutrition Tracking Tips |
| Q3: Optimization | Plateau-Breaking Techniques, Stress & Cortisol Effects, Reassessing Goals, Mental Health Check-Ins |
| Q4: Sustainability | Creating Lasting Habits, Group/Resource Utilization, Milestone Celebrations, Ongoing Motivation |

### Interaction
- Tap a day → zooms into Daily View
- Tap any node → opens linked screen
- Swipe to view other weeks in month

---

## Daily View (Fully Zoomed In)

**Purpose**: Show today's tasks, drive daily engagement, build streaks

**Visual**: Short winding path with 4-5 close nodes, immediate surroundings (park path, sidewalk)

### Nodes Per Day (4-5)

| # | Node | Icon | Description | Links To | Interaction |
|---|------|------|-------------|----------|-------------|
| 1 | **Medication** | 💊 Pill / 💉 Syringe | "Did you take your meds today?" | Medication tracker | Quick yes/no tap |
| 2 | **Nutrition** | 🍎 Apple / 🍽️ Plate | Log meals, track hydration | Food logger | Tap to log meal |
| 3 | **Movement** | 🏃 Running figure | Steps, workout, active minutes | Activity tracker | Auto-sync or manual log |
| 4 | **Rest** | 🌙 Moon / 😊 Mood | Sleep log (last night), stress/mood check-in | Sleep/mood tracker | Quick mood selector |
| 5 | **Sleep** | 🛏️ Bed | Evening prompt: "Time to rest" | Sleep reminder | Sets bedtime goal |

### What's NOT on Daily View
- No provider check-in (weekly)
- No weigh-in (weekly)
- No medication review (weekly)
- No deep education (monthly)
- No goal reassessment (weekly)

### Daily Mechanics
- Nodes glow when ready to complete
- Nodes show checkmark when done
- Points awarded per node (10 pts each)
- Streak increments when all core nodes completed
- Quick interactions: yes/no, sliders, photo upload

### Interaction
- Tap any node → quick-log modal or opens full tracker screen
- Completing all nodes → streak animation fires

---

## Quick Reference: What's On Each View

| Activity | Daily | Weekly | Monthly | Quarterly |
|----------|:-----:|:------:|:-------:|:---------:|
| Medication tracking | ✓ | | | |
| Meal logging | ✓ | | | |
| Workout/steps | ✓ | | | |
| Sleep/mood | ✓ | | | |
| Provider check-in | | ✓ | | |
| Weigh-in/metrics | | ✓ | | |
| Medication review | | ✓ | | |
| Education (5-10 min) | | ✓ | | |
| Education (20-30 min) | | | ✓ | |
| Goal check | | ✓ | | |
| Goal reassessment | | ✓ | | |
| SMART goals | | ✓ | | |
| Weekly milestone | | ✓ | | |
| Monthly reflection | | | ✓ | |
| Monthly milestone | | | ✓ | |
| Quarterly milestone | | | | ✓ |
| Streak tracking | ✓ | | | |

---

## How Journey Map Integrates With Other Screens

The Journey Map is the **central navigation hub**. Every node links to a dedicated screen elsewhere in the app:

| Node Type | Opens Screen | Screen Function |
|-----------|--------------|-----------------|
| Medication nodes | Medication Tracker | Log doses, set reminders, track adherence |
| Nutrition nodes | Food Logger | Photo logging, calorie/macro entry, hydration |
| Movement nodes | Activity Tracker | Steps, workouts, Apple Health/Google Fit sync |
| Sleep/mood nodes | Rest Tracker | Sleep hours, quality, mood selector, stress check |
| Education nodes | Learning Library | Video modules, quizzes, interactive content |
| Goal nodes | Goal Editor | SMART goal setup, progress view, adjustments |
| Provider nodes | Messaging/Scheduling | Secure chat, appointment booking, weekly check-in |
| Weigh-in nodes | Metrics Dashboard | Weight log, body composition, Withings sync |
| Medication review nodes | Medication Tracker | Dose adjustments, side effects survey |
| Reflection nodes | Journal Prompts | Guided reflection questions, wins/challenges |
| Milestone nodes | Celebration Modal | Badge earned, points bonus, share option |

### Data Flow
- Completing actions on other screens → updates node state on Journey Map
- Journey Map always reflects real-time progress
- Tapping completed nodes → shows summary or lets user view/edit entry

---

## Escalation & AI Support

| Element | Placement | Function |
|---------|-----------|----------|
| **AI Chat Button** | Floating button (bottom right, all views) | 24/7 questions, guidance, tips |
| **Escalate to Clinic** | Inside AI chat or Provider node | One-tap outreach to care team |
| **Auto-escalation** | Background trigger | Fires if adherence <50% for 2+ weeks, high stress flags, missed check-ins |
| **Nudges** | Push notifications | Incomplete nodes, streak reminders, education prompts |

---

## Technical Integrations (For Dev Reference)

| Journey Map Feature | Integration Required |
|---------------------|---------------------|
| Weight/body comp nodes | Withings API |
| Activity/steps nodes | Apple Health / Google Fit |
| Meal logging nodes | Photo upload + manual entry |
| Provider messaging nodes | In-app secure chat system |
| Education nodes | Learning library content database |
| AI chat button | Claude / GPT-powered chat |

---

## Deliverables for Design Team

1. **Quarterly View** — 4 island nodes, nature→city, full 12-month path (reference: Mission Journey image ✓)
2. **Monthly View** — Path through quarter environment, 3-4 nodes per month (deep education, reflection, milestone)
3. **Weekly View** — Closer path, 8-9 nodes per week (provider check-in, weigh-in, medication review, goal check, nutrition summary, fitness summary, education, reflection, milestone)
4. **Daily View** — Short path, 4-5 nodes (medication, nutrition, movement, rest, sleep)
5. **Node state designs** — Locked, unlocked, in-progress, completed
6. **Top bar** — Streak counter, points, view toggle
7. **Animations** — Node unlock glow, streak fire, milestone celebration
8. **AI chat floating button**

---

## Summary

**One Journey Map screen. Four zoomable views. Every node tappable.**

- **Quarterly**: 4 phase milestones (Foundation → Momentum → Optimization → Sustainability)
- **Monthly**: 3-4 nodes (deep education, monthly goal review, reflection, milestone)
- **Weekly**: 8-9 nodes (provider check-in, weigh-in, medication review, goal check, nutrition summary, fitness summary, education, reflection, milestone)
- **Daily**: 4-5 nodes (medication, nutrition, movement, rest, sleep)

Path winds through nature→city environment. Streak and points at top. All nodes link to existing app screens.

---

