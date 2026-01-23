# Progress & Stats Screen Specification

## Screen Overview
**Screen ID**: S08  
**Screen Name**: Progress & Stats  
**Type**: Main App - Analytics & Visualization  
**Purpose**: Comprehensive view of user's weight loss journey with detailed analytics, trends, comparisons, and milestone tracking.

## Visual Design

### Layout Structure
- Header with date range selector
- Tab navigation for different views
- Primary metric display
- Interactive charts/graphs
- Milestone timeline
- Export/share options

### UI Components

1. **Header Section**
   - Screen title: "Your Progress"
   - Date range selector (Week/Month/3 Months/Year/All)
   - Filter options icon
   - Export/Share button

2. **Summary Cards** (Horizontal scroll)
   - Total Weight Lost: [X] lbs
   - Days on Program: [N]
   - Current Streak: [Y] days
   - Goals Achieved: [Z/Total]
   - Average Weekly Loss: [A] lbs

3. **Tab Navigation**
   - Overview
   - Weight
   - Measurements
   - Photos
   - Health Metrics
   - Achievements

4. **Overview Tab**
   - Combined progress chart (weight + goals)
   - Key milestones timeline
   - Compliance percentage
   - Quick stats summary
   - Projected goal date

5. **Weight Tab**
   - **Primary Chart**
     - Line graph with trend line
     - Goal weight reference line
     - Touch to see daily values
     - Pinch to zoom
   - **Statistics**
     - Starting: [X] lbs
     - Current: [Y] lbs  
     - Lowest: [Z] lbs
     - Total Lost: [A] lbs
     - % of Goal: [B]%
   - **Rate Analysis**
     - This week: -[X] lbs
     - This month: -[Y] lbs
     - Average rate: [Z] lbs/week

6. **Measurements Tab**
   - Body measurement charts
   - Waist, hips, chest, arms, etc.
   - Comparison view (start vs current)
   - Inches lost totals
   - Add measurement button

7. **Photos Tab**
   - Photo comparison grid
   - Before/After slider view
   - Timeline view option
   - Share comparison feature
   - Add new photo button

8. **Health Metrics Tab**
   - Blood pressure trends
   - Glucose levels (if tracked)
   - Medication changes
   - Lab results timeline
   - Provider notes integration

9. **Achievements Tab**
   - Earned badges/milestones
   - Progress toward next achievement
   - Shareable achievement cards
   - Points/rewards earned
   - Leaderboard position (optional)

## Data Requirements

### Display Data
```json
{
  "progressData": {
    "dateRange": {
      "start": "date",
      "end": "date",
      "preset": "week|month|3months|year|all"
    },
    "summary": {
      "totalWeightLost": "number",
      "daysOnProgram": "number",
      "currentStreak": "number",
      "goalsAchieved": "number",
      "totalGoals": "number",
      "averageWeeklyLoss": "number"
    },
    "weightData": [{
      "date": "date",
      "weight": "number",
      "trend": "number",
      "note": "string"
    }],
    "measurements": {
      "types": ["waist", "hips", "chest", "arms"],
      "data": [{
        "date": "date",
        "values": {
          "waist": "number",
          "hips": "number"
        }
      }]
    },
    "photos": [{
      "id": "string",
      "date": "date",
      "url": "string",
      "type": "front|side|back",
      "isComparison": "boolean"
    }],
    "healthMetrics": {
      "bloodPressure": [{
        "date": "date",
        "systolic": "number",
        "diastolic": "number"
      }],
      "glucose": [{
        "date": "date",
        "value": "number",
        "type": "fasting|random"
      }],
      "medications": [{
        "name": "string",
        "changes": [{
          "date": "date",
          "dose": "string",
          "action": "started|changed|stopped"
        }]
      }]
    },
    "achievements": [{
      "id": "string",
      "name": "string",
      "description": "string",
      "earnedDate": "date",
      "icon": "url",
      "points": "number",
      "shareable": "boolean"
    }]
  }
}
```

### Chart Calculations
- Moving averages
- Trend lines
- Projected goal date
- Rate of change
- Statistical analysis

## User Actions

### Primary Actions
1. **Change Date Range**
   - Select preset ranges
   - Custom date picker
   - Update all charts

2. **Navigate Tabs**
   - Swipe or tap
   - Maintain date range
   - Load tab-specific data

3. **Interact with Charts**
   - Touch for data points
   - Pinch to zoom
   - Pan to scroll
   - Long press for details

4. **Add New Data**
   - Quick add buttons
   - Navigate to entry screens
   - Immediate chart updates

### Secondary Actions
1. **Export/Share**
   - Generate PDF report
   - Share achievements
   - Export data (CSV)
   - Social media sharing

2. **Filter/Customize**
   - Show/hide metrics
   - Change chart types
   - Set comparison periods
   - Adjust goals

3. **View Details**
   - Tap any data point
   - See notes/context
   - Edit historical data
   - Add annotations

## Navigation Flow

### Entry Points
- Bottom navigation
- Dashboard progress card
- Notification shortcuts
- Quick actions

### Connected Screens
- Weight Entry (S10)
- Photo Capture (S19)
- Measurements Entry
- Goal Setting (S05)
- Share/Export flows

## Business Rules

1. **Data Visibility**
   - Show all historical data
   - Highlight provider-added notes
   - Flag unusual changes
   - Respect privacy settings

2. **Chart Display**
   - Minimum 7 days for trends
   - Smooth missing data points
   - Show goal references
   - Adaptive Y-axis scaling

3. **Achievement Logic**
   - Real-time badge earning
   - Retroactive achievements
   - Shareable formats
   - Points calculation

4. **Export Rules**
   - Include selected date range
   - Respect privacy settings
   - Watermark shared images
   - HIPAA compliant exports

## Error Handling

1. **Missing Data**
   - Show empty states
   - Encourage data entry
   - Interpolate when appropriate
   - Clear messaging

2. **Chart Errors**
   - Fallback visualizations
   - Text-based alternatives
   - Retry loading
   - Cache previous views

## Performance Optimization

1. **Data Loading**
   - Progressive loading
   - Cache recent queries
   - Lazy load images
   - Optimize chart rendering

2. **Chart Performance**
   - Limit data points displayed
   - Use WebGL for complex charts
   - Throttle interactions
   - Pre-calculate trends

## Analytics & Tracking

### Events to Track
- Tab views and duration
- Chart interactions
- Export/share actions
- Date range changes
- Achievement views

### Insights
- Most viewed metrics
- Sharing patterns
- Engagement depth
- Feature discovery

## Platform-Specific Considerations

### iOS
- Native chart frameworks
- Haptic feedback
- 3D touch previews
- Health app integration

### Android
- Material chart libraries
- Smooth animations
- Widget support
- Google Fit sync

## Mockup References
- **Apple Health**: Clean data visualization
- **Fitbit**: Comprehensive progress views
- **MyFitnessPal**: Simple, effective charts
- **Strava**: Achievement system

## Success Metrics
- Screen engagement time
- Share rate
- Data exploration depth
- Return visit frequency
- Export usage

## Technical Notes
- Use D3.js or native chart libraries
- Implement smooth animations
- Support landscape orientation
- Offline data viewing
- Real-time sync updates
- Accessibility for data tables