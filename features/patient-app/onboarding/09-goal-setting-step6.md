# Goal Setting Screen Specification (Step 6)

## Screen Overview
**Screen ID**: S09  
**Screen Name**: Goal Setting  
**Type**: Onboarding - Step 6  
**Purpose**: Establish personalized SMART goals for weight loss, lifestyle changes, and health improvements. This screen captures patient motivations and sets measurable targets for the program.

## Visual Design

### Layout Structure
- Fixed header with:
  - Back arrow navigation
  - Step indicator (6 of 7)
  - "Your Goals" title
  - Motivational icon (target/star)
- Scrollable content with:
  - Goal categories in expandable sections
  - Visual goal builders
  - Sliders and input fields
  - Motivation cards
- Fixed footer with:
  - Progress indicator bar (86% complete)
  - "Set My Goals" button

### UI Components
1. **Goal Category Cards**
   - Weight Loss Goals (primary)
   - Lifestyle Goals
   - Prevention Goals
   - Personal Motivations

2. **Interactive Elements**
   - Weight loss slider with live calculations
   - Timeline picker
   - Checkbox lists for multiple selections
   - Priority ranking drag-and-drop

3. **Visual Feedback**
   - Real-time feasibility indicators
   - Milestone previews
   - Success probability estimates

## Data Requirements

### Input Data

#### 1. Weight Loss Goals
```json
{
  "weight_goals": {
    "starting_weight": "number", // Auto-populated from intake
    "starting_bmi": "number", // Calculated
    "target_weight": "number",
    "target_bmi": "number", // Auto-calculated
    "weight_to_lose": "number", // Auto-calculated
    "percent_body_weight": "number", // Auto-calculated
    "timeline": {
      "target_date": "date",
      "weeks_to_goal": "number",
      "monthly_targets": [
        {
          "month": "number",
          "target_weight": "number",
          "target_loss": "number"
        }
      ]
    },
    "pace_preference": "aggressive|moderate|conservative",
    "realistic_assessment": {
      "weekly_loss_rate": "number", // lbs per week
      "achievability_score": "number", // 0-100
      "recommended_adjustment": "string"
    }
  }
}
```

#### 2. Lifestyle Goals
```json
{
  "lifestyle_goals": {
    "primary_motivations": [
      "energy_improvement",
      "increase_longevity",
      "healthy_lifestyle",
      "increase_mobility",
      "aesthetic",
      "medical_necessity",
      "family_health",
      "mental_health"
    ],
    "specific_goals": {
      "energy": {
        "selected": "boolean",
        "current_level": "1-5",
        "target_level": "1-5",
        "importance": "high|medium|low"
      },
      "mobility": {
        "selected": "boolean",
        "current_limitations": ["string"],
        "target_activities": ["string"],
        "importance": "high|medium|low"
      },
      "appearance": {
        "selected": "boolean",
        "clothing_size_goal": "string",
        "specific_areas": ["string"],
        "importance": "high|medium|low"
      }
    },
    "life_events": {
      "has_upcoming_event": "boolean",
      "event_type": "wedding|reunion|vacation|medical_procedure|other",
      "event_date": "date",
      "event_description": "string"
    }
  }
}
```

#### 3. Health Prevention Goals
```json
{
  "prevention_goals": {
    "conditions_to_prevent": [
      {
        "condition": "prediabetes|diabetes|hypertension|kidney_disease|liver_disease|cardiovascular_disease",
        "current_risk": "low|moderate|high",
        "family_history": "boolean",
        "importance": "high|medium|low"
      }
    ],
    "health_improvements": {
      "blood_sugar": {
        "improve": "boolean",
        "current_a1c": "number",
        "target_a1c": "number"
      },
      "blood_pressure": {
        "improve": "boolean",
        "current_bp": "string",
        "target_bp": "string"
      },
      "cholesterol": {
        "improve": "boolean",
        "current_ldl": "number",
        "target_ldl": "number"
      }
    }
  }
}
```

#### 4. Behavioral Goals
```json
{
  "behavioral_goals": {
    "nutrition": {
      "daily_calorie_target": "number",
      "meals_per_day": "number",
      "home_cooking_days": "number",
      "vegetable_servings": "number",
      "water_intake_oz": "number"
    },
    "physical_activity": {
      "weekly_exercise_minutes": "number",
      "exercise_days_per_week": "number",
      "step_goal": "number",
      "preferred_activities": ["string"],
      "barriers_to_address": ["string"]
    },
    "lifestyle": {
      "sleep_hours_target": "number",
      "stress_management": ["string"],
      "alcohol_reduction": "boolean",
      "smoking_cessation": "boolean"
    }
  }
}
```

#### 5. SMART Goals Framework
```json
{
  "smart_goals": [
    {
      "goal_id": "uuid",
      "category": "weight|nutrition|exercise|health",
      "specific": "string", // What exactly will be accomplished?
      "measurable": "string", // How will progress be measured?
      "achievable": "string", // Is this realistic?
      "relevant": "string", // Why does this matter?
      "time_bound": "string", // When will this be achieved?
      "milestones": [
        {
          "date": "date",
          "target": "string",
          "measurement": "string"
        }
      ],
      "priority": "number" // 1-5
    }
  ]
}
```

### Output Data
```json
{
  "patient_goals": {
    "id": "uuid",
    "patient_id": "uuid",
    "weight_goals": {...},
    "lifestyle_goals": {...},
    "prevention_goals": {...},
    "behavioral_goals": {...},
    "smart_goals": [...],
    "provider_approved": "boolean",
    "last_reviewed": "date",
    "adjustments": [
      {
        "date": "date",
        "previous_goal": "string",
        "new_goal": "string",
        "reason": "string"
      }
    ],
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

## User Actions

### Primary Actions
1. **Set Weight Goal**
   - Drag slider to target weight
   - Select timeline (3, 6, 12 months)
   - View projected progress chart
   - Accept or adjust recommendations

2. **Select Motivations**
   - Tap motivation cards
   - Rank by importance (drag to reorder)
   - Add custom motivations
   - Link to specific outcomes

3. **Build SMART Goals**
   - Use guided goal builder
   - Fill in each SMART component
   - Set milestone dates
   - Preview goal summary

4. **Set My Goals**
   - Review all goals
   - Confirm commitment
   - Navigation: → App Tutorial (S10)

### Secondary Actions
1. **Calculate Feasibility**
   - "Is this realistic?" button
   - Shows success probability
   - Suggests adjustments
   - Evidence-based recommendations

2. **View Examples**
   - Sample goals by category
   - Success stories
   - Common goal patterns
   - Inspiration gallery

3. **Get Recommendations**
   - AI-powered suggestions
   - Based on similar patients
   - Personalized to conditions
   - Provider-validated options

## Validation Rules

### Goal Feasibility
```javascript
const validateWeightGoal = (current, target, weeks) => {
  const totalLoss = current - target;
  const weeklyRate = totalLoss / weeks;
  
  if (weeklyRate > 2) {
    return {
      valid: false,
      message: "Goals exceeding 2 lbs/week may be unsafe",
      recommendation: "Consider extending your timeline"
    };
  }
  
  if (weeklyRate < 0.5) {
    return {
      valid: true,
      message: "Conservative goal - great for long-term success",
      recommendation: null
    };
  }
  
  return {
    valid: true,
    message: "Realistic and healthy goal",
    recommendation: null
  };
};
```

### Required Fields
- At least one weight goal
- Minimum 3 lifestyle motivations
- At least one SMART goal
- Timeline selection

### Logical Constraints
- Target weight must be less than current
- Timeline must be future date
- Goals must be measurable
- Milestones must be chronological

## Business Rules

1. **Goal Recommendations**
   ```javascript
   const recommendGoals = (patient) => {
     const bmiReduction = patient.bmi - 25; // Target normal BMI
     const weightLoss = bmiReduction * patient.height * patient.height / 703;
     
     return {
       weight: {
         conservative: weightLoss * 0.7,
         moderate: weightLoss * 0.85,
         aggressive: weightLoss
       },
       timeline: {
         conservative: Math.ceil(weightLoss / 0.5), // weeks at 0.5 lb/week
         moderate: Math.ceil(weightLoss / 1), // weeks at 1 lb/week
         aggressive: Math.ceil(weightLoss / 1.5) // weeks at 1.5 lb/week
       }
     };
   };
   ```

2. **Milestone Generation**
   - Monthly weight targets
   - Behavioral checkpoints
   - Health marker goals
   - Celebration points

3. **Goal Adjustment Protocol**
   - Review at each appointment
   - Adjust based on progress
   - Maintain motivation
   - Document changes

## Psychological Considerations

### Motivation Enhancement
1. **Positive Framing**
   - Focus on gains, not losses
   - Celebrate small wins
   - Build confidence
   - Reduce shame/guilt

2. **Realistic Expectations**
   - Evidence-based targets
   - Account for plateaus
   - Prepare for challenges
   - Sustainable changes

3. **Personal Connection**
   - Link to values
   - Connect to life goals
   - Family/social benefits
   - Quality of life focus

### Behavioral Design
- Choice architecture
- Default to moderate goals
- Nudge toward realistic targets
- Gamification elements

## Analytics & Tracking

### Events to Track
- `screen_view`: Goal Setting displayed
- `goal_set`: Each goal created
- `slider_adjusted`: Weight target changes
- `motivation_selected`: Which motivations chosen
- `timeline_selected`: Chosen timeframe
- `feasibility_checked`: Used calculator
- `goals_confirmed`: Completed setup

### Success Metrics
- Goal completion rates
- Correlation with outcomes
- Adjustment frequency
- Patient satisfaction
- Long-term adherence

## Clinical Integration

### Provider Review
1. **Goal Appropriateness**
   - Clinical safety check
   - Realistic assessment
   - Medical considerations
   - Approval workflow

2. **Progress Monitoring**
   - Dashboard indicators
   - Alert thresholds
   - Adjustment triggers
   - Success celebrations

### Treatment Planning
- Medication titration aligned
- Appointment scheduling
- Support intensity
- Resource allocation

## Accessibility Requirements

### Inclusive Design
- Voice input for goals
- Large touch targets
- High contrast visuals
- Screen reader optimization

### Cognitive Accessibility
- Simple language
- Visual aids
- Step-by-step guidance
- Examples provided

### Cultural Sensitivity
- Diverse goal examples
- Multiple languages
- Cultural food preferences
- Religious considerations

## Platform Considerations

### iOS
- iOS Health app integration
- Siri shortcuts for logging
- Widget for goal tracking
- Apple Watch companion

### Android
- Google Fit integration
- Assistant actions
- Home screen widgets
- Wear OS support

## Gamification Elements

### Achievement System
1. **Milestone Badges**
   - First 5 lbs lost
   - 1 month streak
   - Goal achieved
   - Healthy habits formed

2. **Progress Visualization**
   - Journey map
   - Progress bars
   - Celebration animations
   - Share achievements

3. **Social Features**
   - Goal buddies (optional)
   - Success stories
   - Community challenges
   - Provider kudos

## Success Metrics
- Goal achievement rate > 70%
- Patient engagement with goals
- Goal adjustment frequency
- Satisfaction scores > 4.5/5
- Long-term success correlation

## Technical Notes
- Implement goal recommendation engine
- Cache calculations locally
- Real-time feasibility feedback
- Support offline goal setting
- Sync across devices
- Export goals to calendar
- Integration with reminder system