# Add Activity Screen Specification

## Screen Overview
**Screen ID**: S16  
**Screen Name**: Add Activity Screen  
**Type**: Main App - Activity Tracking  
**Purpose**: Allows users to log physical activities and exercises, tracking fitness minutes for CDC compliance and earning points through gamification.

## Visual Design

### Layout Structure
- Header with back navigation and "Save" button
- Activity type selector
- Activity details form
- Duration and intensity inputs
- Calorie burn calculator
- Points earned preview
- Notes section
- Bottom save confirmation

### UI Components

1. **Header Section**
   - Back arrow navigation
   - Screen title: "Log Activity"
   - Save button (disabled until required fields filled)
   - Points earned badge preview

2. **Activity Type Selector**
   - **Quick Select Categories**
     - Walking/Running
     - Strength Training
     - Cardio/Aerobic
     - Flexibility/Stretching
     - Sports
     - Other Activities
   - **Search Bar**
     - "Search activities..."
     - Auto-complete suggestions
     - Recent activities

3. **Activity Details Form**
   - **Selected Activity Display**
     - Activity icon
     - Activity name
     - Category badge
   - **Duration Input**
     - Time picker (hours/minutes)
     - Quick select: 15, 30, 45, 60 min
     - Manual input option
   - **Intensity Selector**
     - Low (can talk normally)
     - Moderate (somewhat hard to talk)
     - High (very hard to talk)
     - Visual indicators for each level

4. **CDC Compliance Tracking**
   - **Fitness Minutes Counter**
     - Weekly progress bar
     - Current week total: "XXX of 150 minutes"
     - Daily average indicator
   - **Intensity Multiplier Display**
     - Low: 1x minutes
     - Moderate: 1x minutes
     - High: 2x minutes (counts double)

5. **Metrics Display**
   - **Calories Burned**
     - Auto-calculated based on:
       - Activity type
       - Duration
       - Intensity
       - User's weight
     - Editable field
   - **Distance** (if applicable)
     - Miles/kilometers toggle
     - GPS tracking option
   - **Heart Rate** (optional)
     - Manual input
     - Wearable sync indicator

6. **Gamification Section**
   - **Points Preview**
     - Base points for activity
     - Bonus points indicators:
       - Meeting daily goal
       - Consistency streak
       - New activity type
       - High intensity bonus
   - **Achievement Unlocks**
     - "You're about to earn: [Badge Name]"
     - Progress to next level

7. **Additional Details**
   - **When** 
     - Date picker (defaults to today)
     - Time of day
   - **Where** (optional)
     - Location field
     - Indoor/Outdoor toggle
   - **Notes** (optional)
     - Text area
     - Mood selector
     - How you felt (1-5 scale)

8. **Bottom Action Section**
   - **Save Activity** button (primary)
   - **Save and Add Another** (secondary)
   - **Cancel** link

## Data Requirements

### Input Data
```json
{
  "activity": {
    "type": "string",
    "category": "cardio|strength|flexibility|sports|other",
    "customName": "string (if other)",
    "duration": {
      "hours": "number",
      "minutes": "number"
    },
    "intensity": "low|moderate|high",
    "datetime": "ISO 8601",
    "metrics": {
      "caloriesBurned": "number",
      "distance": {
        "value": "number",
        "unit": "miles|km"
      },
      "heartRate": {
        "average": "number",
        "max": "number"
      }
    },
    "location": {
      "name": "string",
      "indoor": "boolean"
    },
    "notes": "string",
    "mood": "1-5",
    "feeling": "string"
  }
}
```

### CDC Compliance Calculations
```json
{
  "fitnessMinutes": {
    "raw": "number",
    "adjusted": "number (with intensity multiplier)",
    "weeklyTotal": "number",
    "weeklyGoal": 150,
    "percentComplete": "number"
  }
}
```

### Points Calculation
```json
{
  "points": {
    "base": "number (duration * rate)",
    "bonuses": {
      "intensity": "number",
      "dailyGoal": "number",
      "streak": "number",
      "newActivity": "number"
    },
    "total": "number"
  }
}
```

## User Actions

### Primary Actions
1. **Select Activity Type**
   - Choose from categories
   - Search for specific activity
   - Select from recent activities

2. **Enter Duration**
   - Use quick select buttons
   - Manual time input
   - Adjust with +/- controls

3. **Select Intensity**
   - Tap intensity level
   - View description helpers
   - See minute multiplier effect

4. **Save Activity**
   - Validate required fields
   - Calculate points and minutes
   - Update progress trackers

### Secondary Actions
1. **Sync Wearable Data**
   - Import from connected device
   - Auto-fill duration and metrics
   - Confirm imported data

2. **Use GPS Tracking**
   - Enable location services
   - Track route for distance
   - Auto-calculate pace

3. **Add to Calendar**
   - Create recurring activity
   - Set reminders
   - Plan future workouts

## Navigation Flow

### Entry Points
- Dashboard quick add button
- Activity history screen
- Daily check-in prompt
- Push notification reminder

### Exit Points
- Save → Dashboard (with success message)
- Save & Add → Clear form for new entry
- Cancel → Previous screen
- Back → Confirmation if unsaved changes

## Business Rules

1. **CDC Fitness Minutes Tracking**
   - Count all activities ≥10 minutes
   - Apply intensity multipliers correctly
   - Track weekly rolling total
   - Reset weekly counter on Sunday midnight

2. **Activity Validation**
   - Minimum duration: 1 minute
   - Maximum single entry: 8 hours
   - Cannot log future activities
   - Maximum 24 hours in the past

3. **Points Award Rules**
   - Base rate: 10 points per 10 minutes
   - Intensity bonus: +25% (moderate), +50% (high)
   - Daily goal bonus: +50 points
   - Streak bonus: +10 points per day
   - Cap daily points at 500

4. **Duplicate Prevention**
   - Warn if similar activity exists
   - Check: same type, ±30 min of time
   - Allow override with confirmation

## Error Handling

1. **Validation Errors**
   - Required fields highlighting
   - Clear error messages
   - Maintain entered data
   - Suggest corrections

2. **Sync Failures**
   - Queue for later sync
   - Show offline indicator
   - Save locally first
   - Retry automatically

3. **Integration Errors**
   - Wearable connection lost
   - GPS unavailable
   - Manual fallback options
   - Clear status messages

## CDC Compliance Features

1. **Weekly Minutes Tracking**
   - Real-time progress updates
   - Visual goal indicators
   - Motivational messages
   - Achievement celebrations

2. **Intensity Education**
   - Clear definitions
   - Examples for each level
   - Talk test explanation
   - Heart rate zones (optional)

3. **Progress Reporting**
   - Weekly summaries
   - Monthly trends
   - CDC goal achievement
   - Provider visibility

## Gamification Elements

1. **Immediate Rewards**
   - Points animation on save
   - Streak counter update
   - Progress bar movement
   - Achievement notifications

2. **Milestone Recognition**
   - First activity logged
   - 7-day streak
   - 150 minutes in week
   - New activity tried
   - Personal records

3. **Social Features**
   - Share achievements
   - Team challenges
   - Leaderboards (opt-in)
   - Encourage others

## Analytics & Tracking

### Events to Track
- Activity type distribution
- Average duration per session
- Intensity preferences
- Time of day patterns
- Completion rates
- Points earned per activity

### Health Metrics
- Weekly fitness minutes
- CDC goal achievement rate
- Activity variety index
- Consistency patterns

## Platform-Specific Considerations

### iOS
- HealthKit integration
- Apple Watch sync
- Siri shortcuts for common activities
- iOS motion tracking

### Android
- Google Fit integration
- Wear OS sync
- Google Assistant commands
- Step counter integration

## Mockup References
- **MyFitnessPal**: Exercise database and search
- **Strava**: Activity detail recording
- **Fitbit**: Quick logging interface
- **Apple Fitness**: Intensity and metrics display

## Success Metrics
- Activities logged per user per week
- CDC goal achievement rate
- Average time to log activity
- Wearable sync usage rate
- Feature engagement scores

## Technical Notes
- Implement activity database with search
- Calculate calories using MET values
- Support offline activity logging
- Integrate with wearable APIs
- Real-time points calculation
- Background sync for large datasets