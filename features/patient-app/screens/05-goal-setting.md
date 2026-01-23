# Goal Setting Screen Specification

## Screen Overview
**Screen ID**: S05  
**Screen Name**: Goal Setting  
**Type**: Onboarding - Personalization  
**Purpose**: Establish personalized health goals, create initial targets, and set expectations for the 12-month journey. Final onboarding step before entering main app.

## Visual Design

### Layout Structure
- Navigation bar with back button
- Progress indicator (Step 4 of 5)
- Interactive goal setting interface
- Visual goal preview
- Educational tooltips
- Completion celebration

### UI Components
1. **Header Section**
   - Back navigation arrow
   - Progress bar showing 80% complete
   - Step indicator: "Step 4 of 5: Your Goals"
   - Motivational subtitle: "Let's set achievable targets for your journey"

2. **Primary Goal Selection**
   - "What's your main goal?" (single select)
     - Lose weight
     - Improve metabolic health
     - Reduce medications
     - Increase energy
     - Enhance mobility
     - Build healthy habits
   - Visual icons for each option
   - Brief description on selection

3. **Weight Goal Setting** (if weight loss selected)
   - Current weight (pre-filled): [X] lbs
   - Target weight slider/input: [Y] lbs
   - Visual indicator:
     - Total to lose: [X-Y] lbs
     - Percentage of body weight: [Z]%
     - Projected timeline: ~[N] months
   - Healthy range indicator (5-10% initial target)
   - "Recommended" vs "Ambitious" markers

4. **Milestone Goals**
   - "What milestones matter to you?" (multi-select)
     - First 10 pounds lost
     - Complete first month
     - Establish exercise routine
     - Improve lab values
     - Fit into specific clothing
     - Participate in an event
     - Custom milestone (text input)
   - Timeline visualization

5. **Behavioral Goals**
   - "Which habits do you want to build?" (select up to 3)
     - Track meals daily
     - Exercise 3x per week
     - Drink 8 glasses of water
     - Sleep 7+ hours nightly
     - Practice stress management
     - Limit processed foods
     - Increase vegetables
     - Regular meal timing

6. **Commitment Level**
   - "How much time can you dedicate daily?"
     - 5-15 minutes (Essential)
     - 15-30 minutes (Recommended)
     - 30+ minutes (Comprehensive)
   - Sets app engagement expectations

7. **Motivation Reminder**
   - "Why is this important to you?" (optional text)
   - Private note for motivation
   - Will appear in app during challenging times

8. **Goal Summary Preview**
   - Visual card showing:
     - Primary goal with icon
     - Target metrics
     - Key milestones
     - Selected habits
     - "Edit" option for each section

9. **Action Buttons**
   - "Set My Goals" (primary)
   - "Adjust Goals" (if reviewing summary)

## Data Requirements

### Input Data
- User health profile from previous screens
- Current weight and BMI
- Medical conditions (affects recommendations)

### Output Data
```json
{
  "userId": "string",
  "goals": {
    "primaryGoal": {
      "type": "string",
      "description": "string"
    },
    "weightGoal": {
      "current": "number",
      "target": "number",
      "toLose": "number",
      "percentageTarget": "number",
      "projectedTimeline": "weeks",
      "aggressiveness": "conservative|moderate|ambitious"
    },
    "milestones": [{
      "id": "string",
      "type": "predefined|custom",
      "description": "string",
      "targetDate": "date",
      "completed": false
    }],
    "behavioralGoals": [{
      "id": "string",
      "habit": "string",
      "frequency": "daily|weekly",
      "trackingMetric": "string"
    }],
    "commitmentLevel": "essential|recommended|comprehensive",
    "motivation": "string",
    "createdAt": "timestamp",
    "agreedToTracking": true
  }
}
```

### Goal Calculations
- Safe weight loss: 1-2 lbs/week
- Initial target: 5-10% of body weight
- Timeline projection based on safe rates
- Adjust for medical conditions

## User Actions

### Primary Actions
1. **Select Primary Goal**
   - Tap goal option
   - View description
   - Confirm selection

2. **Set Weight Target**
   - Use slider or direct input
   - See real-time calculations
   - Adjust based on feedback

3. **Choose Milestones**
   - Select predefined options
   - Add custom milestones
   - Set target dates

4. **Pick Habits**
   - Select up to 3 habits
   - Understand tracking requirements
   - Commit to daily actions

5. **Complete Goal Setting**
   - Review summary
   - Make adjustments
   - Confirm and proceed

### Secondary Actions
1. **Get Recommendations**
   - "Help me choose" options
   - Based on profile and conditions
   - Evidence-based suggestions

2. **Learn More**
   - Tap info icons
   - Understand healthy targets
   - View success stories

## Navigation Flow

### Entry Points
- Consent Form (S04)
- Edit from Profile later

### Exit Points
- Onboarding Complete → Dashboard
- Back to Consent (S03)

### Completion Flow
1. Show success animation
2. "Welcome to OHW!" message
3. Brief app tour preview
4. Navigation: → Dashboard (S06)

## Business Rules

1. **Goal Recommendations**
   - Weight loss: Max 2 lbs/week
   - Initial target: 5-10% of body weight
   - Adjust for age and conditions
   - Flag unrealistic goals

2. **Medical Considerations**
   - Diabetes: Include glucose goals
   - Hypertension: Include BP goals
   - Medications: Consider in timeline
   - Safety limits enforced

3. **Habit Limits**
   - Maximum 3 behavioral goals
   - Start small for success
   - Can add more after 30 days
   - Based on commitment level

4. **Progressive Goals**
   - Break large goals into phases
   - 3-month initial targets
   - Reassess at milestones
   - Celebrate achievements

## Error Handling

1. **Unrealistic Goals**
   - Gentle warning message
   - Education on safe targets
   - Suggest alternatives
   - Allow override with acknowledgment

2. **Incomplete Selections**
   - Highlight required choices
   - Disable proceed until complete
   - Clear guidance provided

## Behavioral Psychology

1. **SMART Goals Framework**
   - Specific selections
   - Measurable metrics
   - Achievable targets
   - Relevant to health
   - Time-bound milestones

2. **Motivation Enhancement**
   - Personal "why" capture
   - Visual progress tracking
   - Small wins focus
   - Social proof elements

3. **Cognitive Load**
   - Progressive disclosure
   - Default recommendations
   - Simple choices
   - Visual feedback

## Analytics & Tracking

### Events to Track
- Goal type selection
- Target aggressiveness
- Milestone choices
- Habit selections
- Time to complete
- Edit frequency

### Success Predictors
- Realistic goal setting
- Multiple milestone selection
- Motivation statement completion
- Moderate commitment level

## Platform-Specific Considerations

### iOS
- Haptic feedback for selections
- Native slider components
- Celebration animation

### Android
- Material Design components
- Smooth transitions
- Achievement sounds

## Mockup References
- **Noom**: Conversational goal setting
- **MyFitnessPal**: Clear target visualization
- **Headspace**: Habit selection interface
- **Fitbit**: Milestone celebration

## Success Metrics
- Goal completion rates
- Target achievement rates
- Goal adjustment frequency
- Long-term retention correlation
- Habit adherence rates

## Technical Notes
- Cache goals locally
- Sync with provider dashboard
- Support goal API for tracking
- Animation framework for celebrations
- A/B test goal suggestions
- Machine learning for personalized targets