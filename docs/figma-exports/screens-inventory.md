# OHW App Screens Inventory

## Source
Figma File: `DDIpRwZyK7uCHtl2RBXs6Y` (OHW Patient UI)

---

## Screen Categories

### Authentication
| Screen | Node ID | Description |
|--------|---------|-------------|
| Login | `2:3107` | Email/password login |
| Login (keyboard) | `2:3142` | Login with keyboard visible |
| Sign Up | `2:3185` | Account creation |
| Login Error | `371:6182` | Login with error state |
| Onboarding | `371:5790` | Initial onboarding flow |

### Main Tabs (Bottom Navigation)

| Tab | Screen | Node ID | Description |
|-----|--------|---------|-------------|
| Home | `420:3817` | Dashboard with daily plan, rank, calories |
| Log Meal | `371:4221` | Food logging with daily totals, water intake |
| Fitness | `420:3573` | Weekly activity summary, today's workouts |
| Education | - | (Not found - may be WIP) |
| Progress | `420:2643` | Weight trend, milestones, achievements |

### Modal/Overlay Screens

| Screen | Node ID | Description |
|--------|---------|-------------|
| Add Activity | `604:3518` | Log workout with type, duration, intensity |
| Measurements | `420:2983` | Body measurements entry |

---

## Screen Details for Journey Map Integration

### Home Screen (`420:3817`)
**Components to preserve/reference:**
- "Your rank" card (Wellness Private badge)
- "Daily Plan" card with calorie ring
- Macro progress bars (Carbs/Protein/Fats)
- Daily checklist (meals, water, activity)
- Weight progress chart

### Progress Screen (`420:2643`) - Will nest inside Journey Map
**Components to extract:**
- Weight Trend card (188 lbs, graph)
- Milestones horizontal scroll (badges)
- Habit Consistency (78% ring)
- Weekly Activity Summary
- **"Your Mission Journey"** section (existing concept!)
- Achievements section

### Log Meal Screen (`371:4221`)
**Components for Daily node actions:**
- Circular calorie ring (1,280 kcal left)
- Water intake tracker (8 cups, pill-style segments)
- Meal cards (Breakfast, Lunch, Dinner, Snacks)

### Add Activity Screen (`604:3518`)
**Components for Daily node actions:**
- Activity type dropdown
- Duration picker (wheel style)
- Intensity pills (Light/Moderate/Vigorous)
- Date/time picker
- Orange "Save Activity" button

---

## Node Tap → Screen Mapping

When user taps a Journey Map node, it opens these screens:

| Node Type | Icon | Opens Screen | Notes |
|-----------|------|--------------|-------|
| Medication | 💊 | Medication Tracker | Quick yes/no or full tracker |
| Nutrition | 🍎 | Log Meal (`371:4221`) | Food logger |
| Movement | 🏃 | Add Activity (`604:3518`) | Activity tracker |
| Rest/Mood | 🌙 | Sleep/Mood Tracker | TBD |
| Water | 💧 | Water Intake (part of Log Meal) | 8 cups tracker |
| Weigh-in | ⚖️ | Measurements (`420:2983`) | Weight log |
| Education | 📚 | Learning Library | Module viewer |
| Provider | 📋 | Messaging/Scheduling | Check-in |

---

## Bottom Navigation Structure

### Current
```
Home | Log Meal | Fitness | Education | Progress
```

### After Journey Map Integration
```
Home | Log Meal | 🗺️ Journey | Fitness | Education
```

**Changes:**
1. "Progress" tab removed from nav
2. "Journey" tab added to CENTER position
3. Progress content accessible via button inside Journey Map

---

## Design Patterns Observed

### Cards
- White background
- 30px border radius
- 20px padding
- Soft orange-tinted shadow

### Progress Indicators
- Circular rings for calorie/consistency tracking
- Horizontal pill-style bars for water intake
- Linear progress bars for macros

### Color Usage
- Orange: Primary CTAs, calorie ring
- Blue: Carbs, water
- Red: Protein
- Yellow/Gold: Fats, points
- Teal: Rank badges

### Typography
- Bold for numbers and headers
- Medium for body text
- Semibold for labels
- SF Pro font family
