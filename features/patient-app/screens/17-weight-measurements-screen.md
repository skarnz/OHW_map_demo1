# Weight & Measurements Screen Specification

## Screen Overview
**Screen ID**: S17  
**Screen Name**: Weight & Measurements  
**Type**: Main App - Progress Tracking  
**Purpose**: Central hub for viewing weight trends, body measurements, and health metrics over time. Provides visualization and insights for both users and providers.

## Visual Design

### Layout Structure
- Header with title and add button
- Summary cards section
- Trend chart area
- Measurement history list
- CDC milestone indicators
- Export/share options

### UI Components

1. **Header Section**
   - Screen title: "Weight & Measurements"
   - Add measurement button (+)
   - Time period selector (Week/Month/3M/6M/Year/All)
   - Settings gear icon

2. **Current Stats Summary**
   - **Weight Card**
     - Current weight (large display)
     - Change from last entry (±X lbs)
     - Days since last weigh-in
     - BMI value and category
   - **Goal Progress Card**
     - Starting weight
     - Current weight  
     - Goal weight
     - Progress bar
     - Projected goal date
   - **Measurements Card**
     - Last updated date
     - Key measurements summary
     - View all measurements link

3. **Trend Visualization**
   - **Weight Chart**
     - Line graph with data points
     - Goal weight reference line
     - Milestone markers
     - Zoom and pan capabilities
     - Toggle between lbs/kg
   - **Chart Controls**
     - Time range selector
     - Show/hide elements
     - Compare periods option
   - **Insight Callouts**
     - Average weekly change
     - Current trend direction
     - Consistency score

4. **CDC Health Metrics**
   - **BMI Category Tracker**
     - Current BMI value
     - Category (with color coding):
       - Underweight (<18.5)
       - Normal (18.5-24.9)
       - Overweight (25-29.9)
       - Obese Class I (30-34.9)
       - Obese Class II (35-39.9)
       - Obese Class III (≥40)
     - Progress through categories
   - **Risk Reduction Indicators**
     - Diabetes risk level
     - Cardiovascular risk
     - Overall mortality risk
     - Based on % weight loss

5. **Measurement Categories**
   - **Weight**
     - Entry frequency reminder
     - Best time to weigh tips
   - **Body Measurements**
     - Waist
     - Hips
     - Chest
     - Arms (bicep)
     - Thighs
     - Neck
   - **Vital Signs** (optional)
     - Blood pressure
     - Resting heart rate
     - Blood glucose
   - **Lab Values** (provider entered)
     - A1C
     - Lipid panel
     - Liver function

6. **History List View**
   - **Entry Items**
     - Date and time
     - Weight value
     - Change from previous
     - Notes icon (if present)
     - Photo indicator
   - **Filters**
     - Date range
     - Measurement type
     - With photos only
   - **Batch Actions**
     - Export selected
     - Delete multiple

7. **Gamification Elements**
   - **Milestone Badges**
     - 5% body weight lost
     - 10% body weight lost
     - BMI category improvement
     - Consistency streaks
   - **Points Display**
     - Points for regular weigh-ins
     - Bonus for reaching milestones
     - Weekly consistency bonus

8. **Bottom Action Bar**
   - **Quick Actions**
     - Add weight
     - Add measurements
     - Take progress photo
     - View reports

## Data Requirements

### Measurement Data Structure
```json
{
  "measurements": {
    "weight": {
      "current": "number",
      "unit": "lbs|kg",
      "history": [{
        "value": "number",
        "date": "ISO 8601",
        "time": "HH:MM",
        "notes": "string",
        "photoId": "string",
        "source": "manual|scale|import"
      }]
    },
    "bodyMeasurements": {
      "waist": "number",
      "hips": "number",
      "chest": "number",
      "bicep": "number",
      "thigh": "number",
      "neck": "number",
      "unit": "inches|cm",
      "lastUpdated": "ISO 8601"
    },
    "vitals": {
      "bloodPressure": {
        "systolic": "number",
        "diastolic": "number"
      },
      "heartRate": "number",
      "bloodGlucose": "number"
    },
    "labValues": {
      "a1c": "number",
      "cholesterol": {
        "total": "number",
        "ldl": "number",
        "hdl": "number",
        "triglycerides": "number"
      }
    }
  }
}
```

### CDC Compliance Metrics
```json
{
  "cdcMetrics": {
    "bmi": {
      "current": "number",
      "category": "string",
      "changeFromStart": "number"
    },
    "weightLossPercentage": "number",
    "riskReduction": {
      "diabetes": "percentage",
      "cardiovascular": "percentage",
      "mortality": "percentage"
    },
    "categoricalProgress": {
      "startCategory": "string",
      "currentCategory": "string",
      "improvementSteps": "number"
    }
  }
}
```

## User Actions

### Primary Actions
1. **Add New Weight**
   - Quick entry from main screen
   - Navigate to Add Weight screen
   - Auto-save with timestamp

2. **View Trends**
   - Change time periods
   - Zoom in/out on chart
   - Compare different ranges

3. **Add Measurements**
   - Full body measurements
   - Individual updates
   - Bulk entry option

### Secondary Actions
1. **Export Data**
   - PDF report generation
   - CSV data export
   - Share with provider
   - Print charts

2. **Set Reminders**
   - Weigh-in schedule
   - Measurement intervals
   - Notification preferences

3. **Compare Progress**
   - Side-by-side periods
   - Before/after overlay
   - Statistical analysis

## Navigation Flow

### Entry Points
- Bottom navigation tab
- Dashboard weight card
- Progress photo comparison
- Provider review request

### Connected Screens
- Add Weight (S18)
- Before/After Photos (S19)
- Progress Stats (S08)
- Provider reports

## Business Rules

1. **Weight Entry Validation**
   - Reasonable range: 50-700 lbs
   - Maximum change warning: >10 lbs/week
   - Minimum interval: 1 hour
   - Future date prevention

2. **CDC Calculations**
   - BMI = weight(kg) / height(m)²
   - Use CDC standard categories
   - Calculate risk reduction percentages
   - Track categorical improvements

3. **Measurement Frequency**
   - Weight: Recommended weekly
   - Body measurements: Bi-weekly
   - Photos: Monthly
   - Labs: Per provider schedule

4. **Data Retention**
   - Keep all historical data
   - Allow user deletion
   - Archive after 2 years
   - Maintain audit trail

## Error Handling

1. **Data Entry Errors**
   - Out of range warnings
   - Unusual change confirmations
   - Unit conversion checks
   - Duplicate entry prevention

2. **Sync Issues**
   - Local storage first
   - Queue for sync
   - Conflict resolution
   - Merge strategies

3. **Chart Rendering**
   - Minimum data points (3)
   - Missing data handling
   - Smooth interpolation
   - Responsive scaling

## CDC Compliance Features

1. **Standardized Metrics**
   - BMI calculations per CDC
   - Risk assessment tools
   - Category definitions
   - Progress milestones

2. **Reporting Requirements**
   - Weekly summaries
   - Monthly progress reports
   - Outcome tracking
   - Provider visibility

3. **Educational Integration**
   - BMI explanation
   - Health risk information
   - Goal setting guidance
   - Success strategies

## Gamification Elements

1. **Achievement System**
   - Weight loss percentages (5%, 10%, 15%)
   - BMI category improvements
   - Consistency streaks
   - Measurement milestones

2. **Points and Rewards**
   - 10 points per weigh-in
   - 25 points per full measurement
   - 50 points per milestone
   - 100 points per category change

3. **Visual Celebrations**
   - Confetti animations
   - Badge unlocking
   - Progress fireworks
   - Share achievements

## Analytics & Tracking

### Events to Track
- Weigh-in frequency
- Measurement completion rates
- Chart interaction patterns
- Export/share usage
- Time spent viewing trends

### Health Outcomes
- Average weight loss rate
- BMI improvements
- Measurement changes
- Goal achievement rates

## Platform-Specific Considerations

### iOS
- HealthKit integration
- Smart scale connectivity
- 3D Touch for quick entry
- Widget for today view

### Android
- Google Fit sync
- Bluetooth scale support
- Home screen widgets
- Wear OS complications

## Mockup References
- **Happy Scale**: Trend analysis and predictions
- **MyFitnessPal**: Weight tracking interface
- **Fitbit**: Comprehensive health metrics
- **Weight Watchers**: Goal visualization

## Success Metrics
- Weekly active users tracking weight
- Average entries per user per month
- Goal achievement rates
- CDC metric improvements
- User satisfaction scores

## Technical Notes
- Implement smooth chart animations
- Support offline data entry
- Bluetooth scale integration
- Advanced trend algorithms
- Predictive goal dates
- Export functionality with charts