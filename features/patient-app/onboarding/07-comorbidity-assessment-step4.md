# Comorbidity Assessment Screen Specification (Step 4)

## Screen Overview
**Screen ID**: S07  
**Screen Name**: Comorbidity Assessment  
**Type**: Onboarding - Step 4  
**Purpose**: Assess qualifying comorbidities for insurance prior-authorization, determine clinical eligibility, and identify risk factors that impact treatment planning.

## Visual Design

### Layout Structure
- Fixed header with:
  - Back arrow navigation
  - Step indicator (4 of 7)
  - "Health Assessment" title
- Scrollable content with:
  - Educational intro section
  - Assessment categories with visual cards
  - Measurement input section
  - Condition checklist
- Fixed footer with:
  - Progress indicator bar (57% complete)
  - "Continue" button

### UI Components
1. **Educational Banner**
   - Info icon with expandable explanation
   - "Why we ask these questions" section
   - Insurance eligibility indicator

2. **Assessment Cards**
   - Visual icons for each condition category
   - Check/uncheck animations
   - Severity indicators where applicable

3. **Measurement Section**
   - Waist circumference input with unit toggle
   - Visual guide for proper measurement
   - Gender-specific threshold indicators

## Data Requirements

### Input Data

#### 1. Waist Measurement
```json
{
  "waist_measurement": {
    "value": "number",
    "unit": "inches|cm",
    "measurement_date": "date",
    "qualifies": "boolean" // Auto-calculated: Men>40", Women>35"
  }
}
```

#### 2. Metabolic Conditions
```json
{
  "metabolic_conditions": {
    "hypothyroidism": {
      "present": "boolean",
      "symptoms": [
        "fatigue",
        "lethargy",
        "dry_skin",
        "brittle_nails",
        "cold_sensitivity",
        "difficulty_losing_weight",
        "hair_loss"
      ],
      "diagnosed": "boolean",
      "treatment": "string"
    }
  }
}
```

#### 3. Cardiovascular Conditions
```json
{
  "cardiovascular_conditions": {
    "coronary_heart_disease": {
      "present": "boolean",
      "symptoms": [
        "elevated_cholesterol",
        "hypertension",
        "poor_circulation",
        "gi_pain",
        "chest_pain",
        "shortness_of_breath",
        "lightheadedness",
        "sweating"
      ],
      "diagnosed": "boolean",
      "medications": ["string"]
    },
    "peripheral_vascular_disease": {
      "present": "boolean",
      "symptoms": [
        "body_hair_loss",
        "skin_thinning",
        "ulcers",
        "cool_skin",
        "buttocks_pain",
        "slow_toenail_growth",
        "leg_sores"
      ]
    },
    "abdominal_aortic_aneurysm": {
      "present": "boolean",
      "symptoms": [
        "abdomen_pain",
        "back_pain",
        "flank_pain",
        "nausea",
        "pulsating_mass"
      ]
    },
    "symptomatic_carotid_artery_disease": {
      "present": "boolean",
      "symptoms": [
        "mini_stroke_tia",
        "stroke_history",
        "temporary_vision_loss"
      ]
    }
  }
}
```

#### 4. Sleep Disorders
```json
{
  "sleep_disorders": {
    "obstructive_sleep_apnea": {
      "present": "boolean",
      "diagnosed": "boolean",
      "using_cpap": "boolean",
      "symptoms": [
        "loud_snoring",
        "breathing_interruptions",
        "daytime_fatigue",
        "morning_headaches"
      ]
    }
  }
}
```

#### 5. Previous Weight Loss History
```json
{
  "weight_loss_history": {
    "previous_programs": {
      "attempted": "boolean",
      "programs": [
        {
          "type": "medical|commercial|self_directed",
          "name": "string",
          "year": "number",
          "duration_months": "number",
          "weight_lost": "number",
          "weight_regained": "number"
        }
      ]
    },
    "previous_medications": {
      "used": "boolean",
      "medications": [
        "phentermine",
        "orlistat",
        "semaglutide",
        "liraglutide",
        "tirzepatide",
        "metformin",
        "naltrexone_bupropion",
        "other"
      ],
      "other_details": "string"
    }
  }
}
```

### Output Data
```json
{
  "patient_comorbidities": {
    "id": "uuid",
    "patient_id": "uuid",
    "waist_measurement_qualifying": "boolean",
    "waist_measurement_value": "number",
    "waist_measurement_unit": "string",
    "conditions": {
      "hypothyroidism": "boolean",
      "coronary_heart_disease": "boolean",
      "obstructive_sleep_apnea": "boolean",
      "peripheral_vascular_disease": "boolean",
      "abdominal_aortic_aneurysm": "boolean",
      "symptomatic_carotid_artery_disease": "boolean"
    },
    "insurance_eligibility_score": "number", // 0-1 scale
    "qualifying_conditions_count": "number",
    "suggested_icd10_codes": ["string"],
    "clinical_notes": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

## User Actions

### Primary Actions
1. **Enter Waist Measurement**
   - Numeric input with unit toggle
   - View measurement guide (modal)
   - Real-time qualification indicator

2. **Select Conditions**
   - Tap condition cards to select
   - Expand for symptom checklist
   - Multiple selections allowed

3. **View Condition Details**
   - Tap info icon for detailed explanation
   - Symptom descriptions
   - When to seek immediate care

4. **Continue**
   - Validates minimum data entry
   - Calculates eligibility score
   - Navigation: → Contraindication Screening (S08)

### Secondary Actions
1. **Back Navigation**
   - Returns to Health History (S06)
   - Preserves selections

2. **Skip Measurement**
   - "I don't know" option
   - Flags for provider follow-up

3. **Learn More**
   - Insurance eligibility criteria
   - Why comorbidities matter
   - Treatment benefits

## Validation Rules

### Required Fields
- Waist measurement OR explicit skip
- At least one selection (even if "none apply")

### Field-Specific Validation
1. **Waist Measurement**
   - Range: 20-80 inches (50-200 cm)
   - Numeric only
   - Auto-conversion between units

2. **Condition Selection**
   - At least view each category
   - Consistent symptom selection

### Business Logic
1. **Insurance Qualification**
   - BMI ≥ 30 OR
   - BMI ≥ 27 with 1+ comorbidity
   - Auto-calculate based on selections

2. **Risk Stratification**
   - High risk: 3+ cardiovascular conditions
   - Moderate risk: 1-2 conditions
   - Low risk: Qualifying by BMI alone

## Business Rules

1. **Clinical Eligibility**
   ```javascript
   const isEligible = (bmi, comorbidities) => {
     if (bmi >= 30) return true;
     if (bmi >= 27 && comorbidities.length > 0) return true;
     return false;
   };
   ```

2. **ICD-10 Code Mapping**
   ```javascript
   const icdCodes = {
     hypothyroidism: ["E03.9"],
     coronary_heart_disease: ["I25.10"],
     obstructive_sleep_apnea: ["G47.33"],
     peripheral_vascular_disease: ["I73.9"],
     hypertension: ["I10"],
     hyperlipidemia: ["E78.5"]
   };
   ```

3. **Insurance Documentation**
   - Generate summary for prior-auth
   - Include all qualifying conditions
   - Provider verification required

## Error Handling

### Validation Errors
- "Please enter a valid waist measurement"
- "Please review all condition categories"
- "Measurement seems unusual, please verify"

### Eligibility Warnings
- "Based on your responses, additional documentation may be needed"
- "Your provider will review your eligibility"
- "Insurance coverage varies by plan"

### System Errors
- Save progress locally
- Retry failed submissions
- Provide customer support contact

## Analytics & Tracking

### Events to Track
- `screen_view`: Comorbidity Assessment displayed
- `measurement_entered`: Waist circumference value
- `condition_selected`: Which conditions checked
- `info_viewed`: Educational content accessed
- `eligibility_calculated`: Qualification status
- `form_completed`: Time to complete

### Metrics
- Average conditions per patient
- Most common comorbidities
- Measurement skip rate
- Insurance qualification rate
- Time to complete assessment

## Clinical Decision Support

### Risk Indicators
1. **Immediate Provider Review**
   - Uncontrolled cardiovascular symptoms
   - Recent stroke/TIA
   - Active cancer treatment

2. **Enhanced Monitoring**
   - Multiple cardiovascular risks
   - Untreated sleep apnea
   - Significant symptoms

3. **Standard Protocol**
   - Well-controlled conditions
   - Previously treated
   - Minimal symptoms

### Treatment Modifications
- Dosing adjustments for conditions
- Additional monitoring requirements
- Contraindication flags
- Referral recommendations

## Accessibility Requirements

### Screen Reader Support
- Condition names and descriptions
- Symptom checklist readout
- Measurement instructions
- Eligibility status announcement

### Visual Accessibility
- High contrast condition cards
- Clear selected/unselected states
- Large touch targets
- Consistent iconography

### Cognitive Accessibility
- Plain language descriptions
- Visual guides for measurements
- Progressive disclosure of complexity
- Clear next steps

## Platform Considerations

### iOS
- HealthKit integration for measurements
- Native measurement picker
- Haptic feedback for selections

### Android
- Google Fit integration option
- Material Design components
- Gesture navigation support

## Integration Points

### Clinical APIs
1. **ICD-10 Service**
   - Real-time code lookup
   - Condition mapping
   - Insurance compatibility

2. **Prior Authorization Service**
   - Eligibility checking
   - Documentation generation
   - Status tracking

### Internal Services
1. **Patient Eligibility Service**
   - Calculate qualification
   - Generate recommendations
   - Flag for review

2. **Risk Stratification Engine**
   - Assess clinical risk
   - Determine monitoring level
   - Alert providers

## Success Metrics
- Completion rate > 98%
- Accurate data entry > 95%
- Insurance approval rate > 80%
- Average time < 3 minutes

## Technical Notes
- Implement smart defaults based on demographics
- Cache ICD-10 codes locally
- Pre-calculate common scenarios
- Support for telemedicine verification
- Real-time insurance eligibility API integration