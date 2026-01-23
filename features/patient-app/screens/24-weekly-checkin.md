# Weekly Check-in Screen Specification

## Screen Overview
**Screen ID**: S24  
**Screen Name**: Weekly Check-in  
**Type**: Engagement - Assessment  
**Purpose**: Structured weekly touchpoint to assess patient progress, identify challenges, gather feedback, and maintain engagement between provider visits. Critical for early intervention and support.

## Visual Design

### Layout Structure
- Welcome header with week number
- Progress summary section
- Check-in questions flow
- Mood/wellness tracker
- Challenge identification
- Support resources
- Submit confirmation

### UI Components

1. **Header Section**
   - "Week [X] Check-in" title
   - Motivational message
   - Progress indicators
   - Estimated time (5-10 min)
   - Skip/Remind later option

2. **Progress Summary**
   - Week's achievements
   - Key metrics comparison
   - Visual progress chart
   - Milestone celebrations
   - Encouraging feedback

3. **Check-in Questions**
   
   **A. Weight & Measurements**
   - Current weight entry
   - Measurement changes
   - Photo comparison toggle
   - Trend visualization
   
   **B. Adherence Assessment**
   - Medication compliance
   - Food tracking consistency
   - Exercise completion
   - Education engagement
   - Sleep quality
   
   **C. Wellness Check**
   - Energy level (1-10 scale)
   - Mood assessment
   - Hunger/satiety levels
   - Side effects checklist
   - Overall feeling

4. **Challenge Identification**
   - Common challenges list
   - Custom challenge input
   - Severity rating
   - Request provider contact
   - Resource suggestions

5. **Goals & Adjustments**
   - Review current goals
   - Adjust targets
   - Set weekly focus
   - Celebration choices
   - Next week preview

6. **Support Section**
   - Suggested resources
   - Community topics
   - Provider message option
   - Emergency contacts
   - Motivational content

## Data Requirements

### Input Data
- User responses
- Metric updates
- Challenge selections
- Goal adjustments
- Support requests

### Display Data
```json
{
  "weeklyCheckIn": {
    "metadata": {
      "weekNumber": "number",
      "checkInDate": "date",
      "programDay": "number",
      "lastCheckIn": "date",
      "streak": "number"
    },
    "progressSummary": {
      "weightChange": "number",
      "goalProgress": "percentage",
      "trackingDays": "number",
      "exerciseMinutes": "number",
      "educationModules": "number",
      "achievements": ["achievementIds"]
    },
    "questions": {
      "measurements": {
        "currentWeight": "number",
        "waistCircumference": "number",
        "photoTaken": "boolean"
      },
      "adherence": {
        "medicationDays": "number",
        "trackingCompleteness": "percentage",
        "exerciseDays": "number",
        "educationEngagement": "percentage",
        "averageSleep": "hours"
      },
      "wellness": {
        "energyLevel": "1-10",
        "mood": "great|good|okay|challenging|difficult",
        "hungerLevel": "well-controlled|occasional|frequent|constant",
        "sideEffects": ["effectIds"],
        "overallFeeling": "text"
      },
      "challenges": [{
        "type": "hunger|cravings|motivation|time|social|other",
        "description": "string",
        "severity": "minor|moderate|major",
        "needsSupport": "boolean"
      }],
      "goals": {
        "currentGoals": [{
          "id": "string",
          "progress": "percentage",
          "continuing": "boolean"
        }],
        "weeklyFocus": "string",
        "adjustments": ["adjustmentIds"]
      }
    },
    "supportNeeds": {
      "requestProviderContact": "boolean",
      "urgency": "routine|soon|urgent",
      "topics": ["topicIds"],
      "preferredContact": "message|phone|visit"
    },
    "recommendations": {
      "resources": [{
        "type": "article|video|tool",
        "title": "string",
        "reason": "string",
        "url": "string"
      }],
      "communityTopics": ["topicIds"],
      "nextSteps": ["actionIds"]
    }
  }
}
```

### Real-time Updates
- Auto-save progress
- Provider notifications
- Resource loading
- Streak tracking

## User Actions

### Primary Actions
1. **Complete Check-in**
   - Answer questions
   - Update metrics
   - Rate wellness
   - Submit responses

2. **Identify Needs**
   - Select challenges
   - Request support
   - Access resources
   - Adjust goals

3. **Review Progress**
   - View comparisons
   - Celebrate wins
   - Acknowledge struggles
   - Plan ahead

### Secondary Actions
1. **Navigation**
   - Save progress
   - Skip sections
   - Previous answers
   - Exit check-in

2. **Support Access**
   - Message provider
   - Browse resources
   - Join community
   - Schedule call

## Navigation Flow

### Entry Points
- Weekly notification
- Dashboard reminder
- Provider request
- Calendar event

### Exit Points
- Dashboard return
- Resource library
- Provider messaging
- Community forum

### Navigation Map
```
Notification → Weekly Check-in → Summary → Dashboard
                              → Resources → Education
                              → Provider → Messaging
                              → Submit → Confirmation
```

## Business Rules

1. **Timing Logic**
   - Weekly on same day
   - 48-hour window
   - Reminder escalation
   - Make-up allowed

2. **Completion Rules**
   - Required questions
   - Skip allowances
   - Partial saves
   - Time limits

3. **Alert Triggers**
   - Weight gain >3 lbs
   - Low mood ratings
   - Multiple challenges
   - Side effects

4. **Support Routing**
   - Severity assessment
   - Provider alerts
   - Resource matching
   - Follow-up scheduling

## Error Handling

1. **Submission Issues**
   - Auto-save drafts
   - Retry mechanism
   - Offline capability
   - Confirmation required

2. **Data Validation**
   - Range checking
   - Consistency verification
   - Missing data prompts
   - Error messaging

## Performance Optimization

1. **Form Efficiency**
   - Progressive disclosure
   - Smart defaults
   - Quick selections
   - Minimal typing

2. **Load Management**
   - Chunked questions
   - Async resources
   - Cached responses
   - Background sync

## Analytics & Tracking

### Events to Track
- Check-in completion rate
- Time to complete
- Challenge frequency
- Support requests
- Resource engagement
- Skip patterns

### Key Metrics
- Weekly engagement
- Mood trends
- Challenge patterns
- Support effectiveness
- Retention correlation

## Platform-Specific Considerations

### iOS
- Widget reminders
- Shortcuts integration
- HealthKit sync
- Focus mode respect

### Android
- Smart notifications
- Google Fit sync
- Assistant reminders
- Do not disturb

## Accessibility Requirements
- Screen reader flow
- Voice input support
- Clear question labeling
- Keyboard navigation
- Time extensions
- Simple language

## Success Metrics
- Completion rate >80%
- Time to complete <10 min
- Support request accuracy
- Intervention effectiveness
- User satisfaction