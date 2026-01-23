# Add Weight Screen Specification

## Screen Overview
**Screen ID**: S18  
**Screen Name**: Add Weight Screen  
**Type**: Main App - Data Entry  
**Purpose**: Quick and easy weight entry interface with smart features for accurate tracking, CDC compliance, and user engagement through gamification.

## Visual Design

### Layout Structure
- Header with cancel/save actions
- Large numeric display
- Input method selector
- Context additions (photo, notes)
- Historical comparison
- Save confirmation with rewards

### UI Components

1. **Header Section**
   - Cancel button (left)
   - Title: "Log Weight"
   - Save button (right, disabled until valid input)
   - Current date/time display

2. **Weight Input Area**
   - **Large Numeric Display**
     - Current input value (XXX.X)
     - Unit toggle (lbs/kg)
     - Decimal precision indicator
   - **Input Methods**
     - Numeric keypad (default)
     - Slider for fine adjustment
     - Voice input option
     - Smart scale sync button

3. **Smart Features**
   - **Outlier Detection**
     - "This seems unusual. You entered XXX lbs"
     - "That's a XX lb change from your last weight"
     - Confirm or correct options
   - **Time of Day Consistency**
     - "You usually weigh in the morning"
     - "Best practice: Same time each day"
     - Set as default time option

4. **Additional Context**
   - **Add Photo**
     - Camera icon button
     - "Add progress photo"
     - Preview if added
   - **Add Notes**
     - Text field (optional)
     - Suggested prompts:
       - "How are you feeling?"
       - "Any changes this week?"
       - "Medication adjustments?"
   - **Factors Affecting Weight**
     - Quick select tags:
       - "Period/Menstrual cycle"
       - "High sodium meal"
       - "Intense workout"
       - "Medication change"
       - "Illness/stress"
       - "Travel"

5. **Historical Context**
   - **Previous Entries Mini-List**
     - Last 3 weigh-ins
     - Date, weight, change
     - Swipe to see more
   - **Trend Indicator**
     - Arrow showing direction
     - "Down X lbs over Y days"
     - Mini sparkline graph

6. **Smart Scale Integration**
   - **Connected Devices**
     - List of paired scales
     - Last sync time
     - Battery status
   - **Sync Status**
     - "Looking for scale..."
     - "Step on scale now"
     - "Weight received: XXX"
     - Manual override option

7. **Gamification Preview**
   - **Points to Earn**
     - "Log weight: +10 points"
     - "Weekly streak: +25 bonus"
     - "With photo: +5 extra"
   - **Milestone Alert**
     - "You're 0.5 lbs from 5% loss!"
     - "3 more weigh-ins for badge"

8. **Save Confirmation**
   - **Success Animation**
     - Weight logged confirmation
     - Points earned animation
     - Streak counter update
   - **Quick Actions**
     - "View Progress" button
     - "Add Measurements" option
     - "Share Achievement" (if milestone)

## Data Requirements

### Input Validation
```json
{
  "weightEntry": {
    "value": "number",
    "unit": "lbs|kg",
    "datetime": "ISO 8601",
    "source": "manual|voice|scale|import",
    "confidence": "high|medium|low",
    "factors": ["string array"],
    "notes": "string",
    "photoId": "string",
    "deviceInfo": {
      "scaleId": "string",
      "scaleName": "string",
      "batteryLevel": "percentage"
    }
  }
}
```

### Validation Rules
```json
{
  "validation": {
    "range": {
      "min": 50,
      "max": 700,
      "unit": "lbs"
    },
    "outlierThreshold": {
      "percentage": 3,
      "absolute": 10
    },
    "frequencyLimit": {
      "minimum": "1 hour",
      "recommended": "daily"
    }
  }
}
```

## User Actions

### Primary Actions
1. **Enter Weight Manually**
   - Type on keypad
   - See real-time BMI update
   - Confirm if outlier detected

2. **Sync from Scale**
   - Tap sync button
   - Step on scale
   - Auto-populate weight

3. **Save Entry**
   - Validate input
   - Show success feedback
   - Update all metrics

### Secondary Actions
1. **Add Context**
   - Take/select photo
   - Write notes
   - Tag factors

2. **Switch Units**
   - Toggle lbs/kg
   - Auto-convert value
   - Save preference

3. **Voice Input**
   - Tap microphone
   - Speak weight
   - Confirm recognition

## Navigation Flow

### Entry Points
- Dashboard quick action
- Weight & Measurements screen
- Daily reminder notification
- Smart scale auto-launch

### Exit Points
- Save → Weight & Measurements (with success)
- Cancel → Previous screen
- Save → Dashboard (if from quick action)
- Share → Social/messaging apps

## Business Rules

1. **CDC Compliance**
   - Encourage weekly weigh-ins minimum
   - Track consistency for reporting
   - Calculate BMI automatically
   - Flag significant changes

2. **Outlier Detection**
   - Warn if >3% change from last
   - Require confirmation
   - Note in provider reports
   - Suggest reweigh if extreme

3. **Best Practices**
   - Same time of day recommended
   - Morning, after bathroom ideal
   - Same clothing/conditions
   - Weekly consistency matters most

4. **Gamification Rules**
   - Base: 10 points per entry
   - Streak bonus: +5 per consecutive week
   - Photo bonus: +5 points
   - Milestone bonus: +50 points
   - Daily limit: 1 scored entry

## Error Handling

1. **Invalid Input**
   - Clear error messages
   - Highlight issue
   - Suggest correction
   - Prevent save until fixed

2. **Scale Connection**
   - Timeout handling (30 seconds)
   - Manual entry fallback
   - Troubleshooting tips
   - Retry options

3. **Network Issues**
   - Save locally first
   - Queue for sync
   - Show sync status
   - Retry automatically

## Smart Features

1. **Predictive Text**
   - Learn user patterns
   - Suggest likely weight
   - Quick confirm option
   - Reduce entry time

2. **Trend Analysis**
   - Show impact on goals
   - Predict goal date
   - Celebrate improvements
   - Motivate during plateaus

3. **Contextual Reminders**
   - "Time for weekly weigh-in"
   - "You usually weigh on Mondays"
   - "Don't forget progress photo"
   - Customizable schedule

## CDC Integration

1. **Data Collection**
   - Timestamp all entries
   - Track entry frequency
   - Calculate weekly averages
   - Monitor compliance

2. **Reporting Features**
   - CDC format compliance
   - Provider visibility
   - Outcome tracking
   - Progress documentation

## Gamification Elements

1. **Immediate Rewards**
   - Points animation
   - Streak celebration
   - Progress bar update
   - Encouraging messages

2. **Achievements**
   - First weigh-in
   - 7-day streak
   - 30-day streak
   - Photo documentation
   - Consistency champion

3. **Social Features**
   - Share milestones
   - Team weigh-in days
   - Support messages
   - Friendly competition

## Analytics & Tracking

### Events to Track
- Entry method used
- Time to complete entry
- Use of additional features
- Outlier confirmations
- Scale sync success rate

### User Patterns
- Preferred weigh-in times
- Entry frequency
- Feature adoption
- Streak maintenance

## Platform-Specific Considerations

### iOS
- HealthKit write access
- Siri weight logging
- HomeKit scale support
- Face ID for privacy

### Android
- Google Fit integration
- Voice command support
- Bluetooth scale APIs
- Biometric privacy lock

## Mockup References
- **Withings Health Mate**: Smart scale integration
- **Happy Scale**: Trend prediction
- **Lose It!**: Quick entry interface
- **Fitbit**: Comprehensive logging

## Success Metrics
- Average time to log weight
- Weekly logging compliance
- Smart scale adoption rate
- Photo attachment rate
- User retention correlation

## Technical Notes
- Implement Bluetooth LE for scales
- Voice recognition for hands-free
- Local caching for offline
- Predictive algorithms
- Photo compression
- Real-time validation