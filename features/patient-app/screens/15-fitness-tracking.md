# Fitness Tracking Screen Specification

## Screen Overview
**Screen ID**: S15  
**Screen Name**: Fitness Tracking  
**Type**: Main App - Activity & Exercise Tracking  
**Purpose**: Comprehensive fitness activity logging, tracking, and analysis. Displays exercise history, progress toward goals, and provides multiple methods for logging physical activity.

## Visual Design

### Layout Structure
- Header with weekly summary
- Activity goals progress
- Today's activities section
- Quick add buttons
- Activity history list
- Bottom navigation bar

### UI Components

1. **Header Section**
   - Title: "Fitness Tracking"
   - Week selector (< Week of July 1 >)
   - Settings icon (goals, preferences)
   - Sync status indicator

2. **Weekly Summary Card**
   - Circular progress ring
     - [X] / [Goal] minutes
     - Center: days active
   - Bar chart (last 7 days)
   - Stats row:
     - Total minutes: 180
     - Calories burned: 1,250
     - Activities: 5

3. **Goals Progress Section**
   - Primary goal: "150 minutes/week"
     - Progress bar: 120/150 (80%)
     - "30 minutes to go!"
   - Secondary goals:
     - Steps: 35,000/50,000 this week
     - Active days: 5/7
     - Strength training: 1/2 sessions

4. **Today's Activities**
   - Date header with total (45 min • 225 cal)
   - Activity cards:
     ```
     🚶 Morning Walk
     7:00 AM - 7:30 AM • 30 min
     1.5 miles • 150 calories
     ♡ 120 avg BPM
     ```
   - Empty state: "No activities yet today"
   - "Log Activity" button

5. **Quick Add Section** (Horizontal scroll)
   - Recent activities chips
   - Common activities:
     - Walking
     - Running
     - Gym
     - Yoga
     - Cycling
     - Swimming
   - "More" button

6. **Activity History** (Grouped by date)
   - Yesterday
     - Activity summaries
   - This Week
     - Daily totals
   - Previous weeks
     - Weekly summaries

7. **Floating Action Button**
   - Plus icon
   - Quick menu:
     - Manual entry
     - Start workout
     - Import from device
     - Log past activity

## Data Requirements

### Input Data
- Activity type and duration
- Heart rate data
- Distance/steps
- Calories burned
- Device sync data
- Manual entries

### Display Data
```json
{
  "fitnessTracking": {
    "weekOf": "2025-07-01",
    "goals": {
      "weeklyMinutes": 150,
      "weeklySteps": 50000,
      "activeDays": 7,
      "strengthSessions": 2
    },
    "weekSummary": {
      "totalMinutes": 120,
      "totalCalories": 850,
      "activeDays": 5,
      "totalSteps": 35000,
      "strengthSessions": 1
    },
    "todayActivities": [{
      "id": "activity_123",
      "type": "walking",
      "name": "Morning Walk",
      "startTime": "2025-07-02T07:00:00Z",
      "endTime": "2025-07-02T07:30:00Z",
      "duration": 30,
      "distance": 1.5,
      "distanceUnit": "miles",
      "calories": 150,
      "heartRate": {
        "average": 120,
        "max": 135,
        "zones": {
          "resting": 5,
          "fatBurn": 20,
          "cardio": 5,
          "peak": 0
        }
      },
      "source": "apple_watch",
      "notes": "Beautiful morning!"
    }],
    "recentActivities": [
      {"type": "walking", "lastLogged": "2025-07-02"},
      {"type": "gym", "lastLogged": "2025-07-01"}
    ],
    "weekHistory": [...]
  }
}
```

### Activity Types Configuration
```json
{
  "activityTypes": {
    "walking": {
      "name": "Walking",
      "icon": "🚶",
      "metrics": ["duration", "distance", "pace"],
      "caloriesPerMinute": 5,
      "metValue": 3.5
    },
    "running": {
      "name": "Running", 
      "icon": "🏃",
      "metrics": ["duration", "distance", "pace", "heartRate"],
      "caloriesPerMinute": 10,
      "metValue": 8.0
    },
    "strength": {
      "name": "Strength Training",
      "icon": "💪",
      "metrics": ["duration", "exercises", "sets"],
      "caloriesPerMinute": 6,
      "metValue": 5.0
    }
  }
}
```

## User Actions

### Primary Actions
1. **Log Activity**
   - Tap FAB or quick add
   - Select activity type
   - Enter details
   - Save to diary

2. **Start Live Workout**
   - Select activity type
   - Start timer
   - Track in real-time
   - Pause/resume
   - Complete and save

3. **Import from Device**
   - Sync wearable
   - Review imported data
   - Confirm activities
   - Merge duplicates

4. **Edit Activity**
   - Tap activity card
   - Modify details
   - Update calories
   - Save changes

### Secondary Actions
1. **Set/Edit Goals**
   - Tap settings
   - Adjust targets
   - Set reminders
   - Save preferences

2. **View Details**
   - Expand activity card
   - See full metrics
   - View route (if applicable)
   - Share achievement

3. **Filter/Search**
   - Filter by type
   - Search by date
   - View specific metrics
   - Export data

4. **Connect Apps/Devices**
   - Link fitness apps
   - Pair wearables
   - Set sync preferences
   - Manage permissions

## Navigation Flow

### Entry Points
- Dashboard quick action
- Bottom navigation
- Notification reminders
- Wearable app sync
- Widget shortcut

### Exit Points
- Activity detail screen
- Manual entry form
- Live workout screen
- Settings/goals
- Connected apps

### Navigation Map
```
Fitness Tracking → Manual Entry Form
                → Live Workout
                → Activity Details
                → Goals Settings
                → Connected Apps
                → Export/Share
```

## Integration Points

### API Endpoints
- GET /api/tracking/fitness?week={date}
- POST /api/tracking/fitness
- PUT /api/tracking/fitness/{id}
- DELETE /api/tracking/fitness/{id}
- POST /api/tracking/fitness/import
- GET /api/tracking/fitness/goals

### Data Sources
- Manual entry service
- Wearable device APIs
- GPS/location services
- Heart rate monitors
- Step counters

### Third-party Integrations
- Apple HealthKit
- Google Fit
- Fitbit API
- Garmin Connect
- Strava API
- MyFitnessPal sync

## Business Rules

1. **Activity Validation**
   - Reasonable duration (1-480 min)
   - Valid calorie ranges
   - Prevent duplicates
   - Auto-detect imports
   - Merge overlapping activities

2. **Calorie Calculations**
   - Use MET values
   - Consider user weight
   - Adjust for heart rate
   - Account for fitness level
   - Validate against norms

3. **Goal Management**
   - CDC minimum: 150 min/week
   - Progressive increases
   - Realistic targets
   - Celebrate achievements
   - Adaptive recommendations

4. **Data Sync Rules**
   - Device priority order
   - Conflict resolution
   - Timezone handling
   - Duplicate prevention
   - Manual override option

## Error Handling

1. **Sync Failures**
   - Retry mechanism
   - Queue for later
   - Manual refresh
   - Clear error messages
   - Support contact

2. **GPS/Sensor Issues**
   - Indoor activity mode
   - Manual distance entry
   - Estimate from history
   - Clear indicators

3. **Data Conflicts**
   - Show both sources
   - User selection
   - Merge option
   - Keep both option

## Performance Optimization

1. **Data Loading**
   - Current week priority
   - Lazy load history
   - Cache recent data
   - Background sync
   - Incremental updates

2. **Battery Efficiency**
   - Smart GPS sampling
   - Efficient sensor use
   - Background limits
   - Sync scheduling
   - Power-saving modes

## Analytics & Tracking

### Events to Track
- Activity logging methods
- Live workout usage
- Device sync frequency
- Goal completion rates
- Feature engagement
- Edit frequency

### Key Metrics
- Weekly active minutes
- Goal achievement rate
- Logging consistency
- Device integration usage
- Activity diversity

## Platform-Specific Considerations

### iOS
- HealthKit integration
- Apple Watch app
- Live Activities
- Workout shortcuts
- Fitness+ integration

### Android
- Google Fit sync
- Wear OS app
- Health Connect API
- Fitness widgets
- Assistant routines

## Accessibility Features
- Voice activity logging
- Large timer display
- Audio pace coaching
- Haptic milestone alerts
- Screen reader optimization
- High contrast mode

## Success Metrics
- 80% weekly goal achievement
- 90% activity logging rate
- <30 seconds to log
- 70% device integration usage
- 85% user retention

## Technical Notes
- Real-time GPS tracking
- Background activity detection
- Sensor fusion algorithms
- Offline capability
- Data compression
- Privacy-first design