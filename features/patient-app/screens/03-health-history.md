# Health History Screen Specification

## Screen Overview
**Screen ID**: S03  
**Screen Name**: Health History  
**Type**: Onboarding - Medical Questionnaire  
**Purpose**: Collect comprehensive health history to ensure program safety and enable personalized treatment plans. Critical for GLP-1 medication eligibility screening.

## Visual Design

### Layout Structure
- Navigation bar with back button
- Progress indicator (Step 2 of 5)
- Scrollable form with collapsible sections
- Save progress indicator
- Continue button at bottom

### UI Components
1. **Header Section**
   - Back navigation arrow
   - Progress bar showing 40% complete
   - Step indicator: "Step 2 of 5: Health History"
   - Auto-save status indicator

2. **Form Sections** (Expandable/Collapsible)
   
   **A. Current Health Status**
   - Current weight* (number input with unit toggle: lbs/kg)
   - Height* (feet/inches or cm)
   - Target weight (optional)
   - Primary health goals (multi-select):
     - Weight loss
     - Improve metabolic health
     - Reduce medications
     - Increase energy
     - Improve mobility
     - Other (text input)

   **B. Medical Conditions**
   - "Do you have any of the following?" (checklist):
     - Type 2 Diabetes
     - Prediabetes
     - High blood pressure
     - High cholesterol
     - Heart disease
     - Thyroid conditions
     - PCOS
     - Sleep apnea
     - Joint problems
     - Mental health conditions
     - None of the above
   - "Other conditions" (text area)

   **C. Medications**
   - "Are you currently taking any medications?" (Yes/No)
   - If Yes: Medication list component
     - Add medication button
     - For each: Name, Dosage, Frequency
   - "Any allergies to medications?" (text input)

   **D. GLP-1 Screening Questions**
   - Previous use of GLP-1 medications? (Yes/No)
   - If Yes: Which ones and results
   - History of pancreatitis? (Yes/No)
   - History of thyroid cancer? (Yes/No)
   - Family history of MEN2? (Yes/No)
   - Currently pregnant or planning? (Yes/No)

   **E. Lifestyle Factors**
   - Exercise frequency (dropdown):
     - Never
     - 1-2 times/week
     - 3-4 times/week
     - 5+ times/week
   - Dietary restrictions (multi-select):
     - Vegetarian
     - Vegan
     - Gluten-free
     - Dairy-free
     - Keto
     - Other
   - Smoking status (select):
     - Never
     - Former
     - Current
   - Alcohol consumption (select):
     - Never
     - Occasionally
     - Regularly

3. **Action Buttons**
   - "Save & Continue" (primary)
   - "Save for Later" (secondary)

## Data Requirements

### Input Data
- All form field values
- User ID from previous screen
- Session timestamp

### Output Data
```json
{
  "userId": "string",
  "healthProfile": {
    "currentWeight": "number",
    "weightUnit": "lbs|kg",
    "height": "object",
    "targetWeight": "number",
    "healthGoals": ["array"],
    "medicalConditions": ["array"],
    "medications": [{
      "name": "string",
      "dosage": "string",
      "frequency": "string"
    }],
    "allergies": "string",
    "glp1History": {
      "previousUse": "boolean",
      "details": "string",
      "contraindicators": {
        "pancreatitis": "boolean",
        "thyroidCancer": "boolean",
        "men2": "boolean",
        "pregnancy": "boolean"
      }
    },
    "lifestyle": {
      "exerciseFrequency": "string",
      "dietaryRestrictions": ["array"],
      "smokingStatus": "string",
      "alcoholUse": "string"
    }
  },
  "completedAt": "timestamp"
}
```

### Validation Rules
- Required fields must be completed
- Weight must be within reasonable range (50-700 lbs)
- Height must be valid
- Medication names cannot be empty
- GLP-1 contraindication flags for safety

## User Actions

### Primary Actions
1. **Complete Form Sections**
   - Expand/collapse sections
   - Enter data with validation
   - Add/remove medications

2. **Save & Continue**
   - Validate required fields
   - Save to backend
   - Check for contraindications
   - Navigation: → Consent Form (S04)

### Secondary Actions
1. **Save for Later**
   - Save partial progress
   - Return to dashboard/login

2. **Back Navigation**
   - Confirm if unsaved changes
   - Navigation: → Account Creation (S02)

3. **Info Icons**
   - Tap for field explanations
   - Medical term definitions

## Navigation Flow

### Entry Points
- Account Creation (S02)
- Resume from saved state

### Exit Points
- Consent Form (S04) - success path
- Account Creation (S02) - back
- Login/Dashboard - save for later

### Conditional Navigation
- If GLP-1 contraindications detected:
  - Show safety alert
  - Offer alternative program options
  - May route to provider review

## Business Rules

1. **Safety Screening**
   - Flag high-risk conditions
   - Require provider review for:
     - BMI < 27
     - Serious contraindications
     - Complex medical history

2. **Auto-Save**
   - Save progress every 30 seconds
   - Save on section completion
   - Indicate save status

3. **Medication Database**
   - Auto-complete common medications
   - Flag potential interactions
   - Validate medication names

4. **BMI Calculation**
   - Calculate automatically
   - Display with interpretation
   - Use for program eligibility

## Error Handling

1. **Validation Errors**
   - Inline field validation
   - Clear error messages
   - Highlight problem sections

2. **Save Failures**
   - Retry automatically
   - Queue for later sync
   - Show user-friendly message

3. **Contraindication Alerts**
   - Clear explanation
   - Next steps provided
   - Contact information

## Clinical Considerations

1. **Provider Review Triggers**
   - BMI outside range
   - Serious contraindications
   - Complex medication list
   - Age considerations

2. **Data Privacy**
   - HIPAA compliance
   - Encryption at rest and transit
   - Audit trail for access

3. **Clinical Decision Support**
   - Flag drug interactions
   - Highlight safety concerns
   - Support provider review

## Analytics & Tracking

### Events to Track
- Section completion rates
- Field abandonment
- Time per section
- Contraindication frequency
- Save for later usage

### Clinical Metrics
- Condition prevalence
- Medication patterns
- Eligibility rates
- Safety flag frequency

## Platform-Specific Considerations

### iOS
- HealthKit integration option
- Native picker controls
- Haptic feedback for selections

### Android
- Google Fit integration option
- Material Design components
- Proper back stack handling

## Mockup References
- **Medical questionnaire best practices**: Progressive disclosure
- **Noom**: Conversational health assessment
- **Healthcare apps**: Clear section organization

## Success Metrics
- Completion rate by section
- Overall form completion
- Time to complete
- Data quality scores
- Provider review rate

## Technical Notes
- Implement section-based validation
- Support offline data entry
- Medication name autocomplete API
- Conditional field display logic
- Accessibility for medical terms
- Support for voice input where appropriate