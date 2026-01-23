# Water Intake Screen Specification

## Screen Overview
**Screen ID**: S27  
**Screen Name**: Water Intake  
**Type**: Tracking - Health Metric  
**Purpose**: Simple and engaging interface for tracking daily water consumption, setting hydration goals, viewing trends, and receiving reminders to maintain proper hydration as part of weight management.

## Visual Design

### Layout Structure
- Daily goal visualization
- Quick add buttons
- Visual progress indicator
- History timeline
- Stats and insights
- Reminder settings

### UI Components

1. **Header Section**
   - "Water Intake" title
   - Today's date
   - Settings gear icon
   - Daily streak badge
   - Goal adjustment link

2. **Progress Visualization**
   
   **A. Primary Display**
   - Animated water bottle/glass fill
   - Current intake: [X] oz/ml
   - Goal: [Y] oz/ml
   - Percentage complete
   - Visual milestone markers
   
   **B. Progress Ring**
   - Circular progress indicator
   - Color-coded zones
   - Animated fill effect
   - Celebration at 100%

3. **Quick Add Section**
   - Preset buttons:
     - 8 oz (1 cup)
     - 16 oz (1 bottle)
     - 20 oz
     - 32 oz
   - Custom amount input
   - Recent amounts
   - Undo last entry

4. **Container Library**
   - Common containers:
     - Glass (8 oz)
     - Coffee mug (12 oz)
     - Water bottle (16-32 oz)
     - Sports bottle (24 oz)
   - Custom containers
   - Visual icons
   - Quick tap to add

5. **History View**
   - Today's log timeline
   - Entry timestamps
   - Running total
   - Edit/delete options
   - Source indicators

6. **Weekly Overview**
   - 7-day bar chart
   - Daily totals
   - Goal line indicator
   - Average intake
   - Streak counter

7. **Insights Section**
   - Hydration tips
   - Personalized recommendations
   - Benefits reminders
   - Achievement unlocks
   - Correlation insights

## Data Requirements

### Input Data
- Water amount entries
- Container selections
- Goal adjustments
- Reminder preferences
- Manual corrections

### Display Data
```json
{
  "waterIntake": {
    "today": {
      "date": "date",
      "goal": "ounces",
      "current": "ounces",
      "percentage": "number",
      "entries": [{
        "id": "string",
        "time": "datetime",
        "amount": "ounces",
        "container": "string",
        "source": "manual|reminder|connected-device"
      }],
      "lastEntry": "datetime",
      "streak": "days"
    },
    "settings": {
      "dailyGoal": "ounces",
      "units": "oz|ml|cups|liters",
      "reminders": {
        "enabled": "boolean",
        "times": ["time"],
        "interval": "hours",
        "smartReminders": "boolean"
      },
      "containers": [{
        "id": "string",
        "name": "string",
        "size": "ounces",
        "icon": "string",
        "isCustom": "boolean"
      }]
    },
    "history": {
      "weekly": [{
        "date": "date",
        "total": "ounces",
        "goal": "ounces",
        "metGoal": "boolean"
      }],
      "monthly": {
        "average": "ounces",
        "goalDays": "number",
        "totalDays": "number",
        "trend": "increasing|stable|decreasing"
      },
      "achievements": [{
        "type": "streak|total|consistency",
        "value": "number",
        "unlockedDate": "date"
      }]
    },
    "insights": {
      "recommendations": [{
        "message": "string",
        "type": "tip|warning|achievement",
        "priority": "high|medium|low"
      }],
      "patterns": {
        "bestDays": ["dayOfWeek"],
        "averageByHour": [{hour, average}],
        "correlations": {
          "weight": "positive|negative|neutral",
          "exercise": "positive|negative|neutral"
        }
      }
    }
  }
}
```

### Real-time Updates
- Entry synchronization
- Progress animation
- Achievement triggers
- Reminder scheduling

## User Actions

### Primary Actions
1. **Log Water**
   - Tap quick add buttons
   - Enter custom amount
   - Select container
   - Confirm entry

2. **Track Progress**
   - View current status
   - Check history
   - Monitor trends
   - Celebrate goals

3. **Manage Settings**
   - Adjust daily goal
   - Set reminders
   - Add containers
   - Change units

### Secondary Actions
1. **History Management**
   - Edit entries
   - Delete mistakes
   - Add missed entries
   - Export data

2. **Insights Interaction**
   - Read tips
   - Dismiss cards
   - Share achievements
   - Get recommendations

## Navigation Flow

### Entry Points
- Dashboard quick action
- Reminder notification
- Widget tap
- Track menu

### Exit Points
- Back to dashboard
- Settings screen
- Share achievement
- Export data

### Navigation Map
```
Dashboard → Water Intake → Quick Add → Confirmation
                       → History → Edit Entry
                       → Settings → Reminders
                       → Insights → Tips
```

## Business Rules

1. **Goal Setting**
   - Default: 64 oz/day
   - Min: 32 oz
   - Max: 200 oz
   - Personalized recommendations

2. **Entry Validation**
   - Max single entry: 64 oz
   - Daily max: 300 oz
   - Time restrictions: none
   - Backdating: 7 days

3. **Reminder Logic**
   - Active hours only
   - Smart intervals
   - Goal-based frequency
   - Pause when met

4. **Achievement Criteria**
   - Streaks: consecutive days
   - Milestones: total ounces
   - Consistency: % of goal
   - Special: perfect weeks

## Error Handling

1. **Entry Errors**
   - Invalid amounts
   - Future dates
   - Duplicate entries
   - Sync conflicts

2. **Goal Issues**
   - Unrealistic goals
   - Unit confusion
   - Reminder conflicts
   - Data corruption

## Performance Optimization

1. **UI Efficiency**
   - Instant feedback
   - Smooth animations
   - Quick calculations
   - Cached totals

2. **Data Management**
   - Local storage
   - Batch syncing
   - Compression
   - Cleanup routines

## Analytics & Tracking

### Events to Track
- Entry frequency
- Goal achievement
- Reminder effectiveness
- Container usage
- Feature engagement
- Time patterns

### Key Metrics
- Daily average intake
- Goal completion rate
- Streak lengths
- Reminder response
- Feature adoption

## Platform-Specific Considerations

### iOS
- Widget support
- Siri shortcuts
- Apple Watch app
- HealthKit integration
- Water emoji support

### Android
- Home widgets
- Google Fit sync
- Wear OS app
- Assistant integration
- Quick tiles

## Gamification Elements
- Streak counters
- Achievement badges
- Progress animations
- Milestone celebrations
- Leaderboards (optional)
- Daily challenges

## Success Metrics
- 85% daily logging rate
- 70% goal achievement
- Improved hydration habits
- Weight loss correlation
- User satisfaction