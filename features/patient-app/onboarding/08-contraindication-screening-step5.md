# Contraindication Screening Screen Specification (Step 5)

## Screen Overview
**Screen ID**: S08  
**Screen Name**: Contraindication Screening  
**Type**: Onboarding - Step 5  
**Purpose**: Critical safety screening to identify conditions that would make GLP-1 agonist therapy unsafe or require special monitoring. This screen ensures patient safety and clinical appropriateness.

## Visual Design

### Layout Structure
- Fixed header with:
  - Back arrow navigation
  - Step indicator (5 of 7)
  - "Safety Screening" title
  - Emergency info icon
- Alert banner:
  - "Important Safety Questions" heading
  - "Your honest answers ensure safe treatment" subtext
- Scrollable content with:
  - Contraindication categories
  - Yes/No toggle questions
  - Expandable detail sections
  - Warning indicators for positive responses
- Fixed footer with:
  - Progress indicator bar (71% complete)
  - "Continue" button (disabled if contraindications present)
  - "Contact Provider" button (if issues detected)

### UI Components
1. **Safety Alert Banner**
   - Yellow background with warning icon
   - Clear importance messaging
   - Links to safety information

2. **Question Cards**
   - Clean white cards with shadows
   - Large Yes/No toggle switches
   - Red highlighting for "Yes" responses
   - Expandable sections for more info

3. **Warning Dialogs**
   - Modal popups for positive responses
   - Clear explanation of risks
   - Options to proceed or contact provider

## Data Requirements

### Input Data

#### 1. GLP-1 Specific Contraindications
```json
{
  "glp1_contraindications": {
    "gastroparesis": {
      "present": "boolean",
      "details": "string",
      "severity": "mild|moderate|severe"
    },
    "pancreatitis_history": {
      "present": "boolean",
      "last_episode": "date",
      "hospitalized": "boolean",
      "cause": "string"
    },
    "thyroid_cancer_history": {
      "present": "boolean",
      "type": "medullary|papillary|follicular|other",
      "family_history_men2": "boolean",
      "treatment_status": "string"
    },
    "multiple_endocrine_neoplasia": {
      "present": "boolean",
      "type": "men1|men2a|men2b",
      "family_history": "boolean"
    }
  }
}
```

#### 2. Kidney Function (Metformin Contraindication)
```json
{
  "kidney_function": {
    "egfr_known": "boolean",
    "egfr_value": "number",
    "egfr_date": "date",
    "egfr_below_30": "boolean",
    "dialysis": "boolean",
    "kidney_disease": {
      "present": "boolean",
      "stage": "1|2|3a|3b|4|5"
    }
  }
}
```

#### 3. Liver Function
```json
{
  "liver_function": {
    "severe_liver_disease": "boolean",
    "cirrhosis": {
      "present": "boolean",
      "child_pugh_class": "a|b|c"
    },
    "active_hepatitis": "boolean",
    "liver_enzymes_elevated": {
      "present": "boolean",
      "times_normal": "number"
    }
  }
}
```

#### 4. Substance Use
```json
{
  "substance_use": {
    "alcohol": {
      "drinks_per_day": "number",
      "heavy_use": "boolean", // >3 drinks/day
      "binge_drinking": "boolean",
      "alcohol_use_disorder": "boolean"
    },
    "illicit_drugs": {
      "current_use": "boolean",
      "substance_type": ["string"],
      "in_recovery": "boolean",
      "recovery_duration": "string"
    }
  }
}
```

#### 5. Pregnancy & Reproductive Health
```json
{
  "reproductive_health": {
    "pregnancy_status": {
      "currently_pregnant": "boolean",
      "trying_to_conceive": "boolean",
      "breastfeeding": "boolean"
    },
    "contraception": {
      "using_contraception": "boolean",
      "method": "string",
      "effectiveness": "high|moderate|low"
    },
    "last_menstrual_period": "date"
  }
}
```

#### 6. Other Medical Conditions
```json
{
  "other_conditions": {
    "diabetic_retinopathy": {
      "present": "boolean",
      "severity": "mild|moderate|severe|proliferative",
      "recent_treatment": "boolean"
    },
    "inflammatory_bowel_disease": {
      "present": "boolean",
      "type": "crohns|ulcerative_colitis",
      "active_flare": "boolean"
    },
    "recent_surgery": {
      "within_30_days": "boolean",
      "type": "string",
      "complications": "boolean"
    },
    "eating_disorder": {
      "history": "boolean",
      "current": "boolean",
      "in_treatment": "boolean"
    }
  }
}
```

### Output Data
```json
{
  "patient_contraindications": {
    "id": "uuid",
    "patient_id": "uuid",
    "absolute_contraindications": ["string"],
    "relative_contraindications": ["string"],
    "requires_specialist_clearance": ["string"],
    "safe_to_proceed": "boolean",
    "provider_review_required": "boolean",
    "risk_level": "low|moderate|high|contraindicated",
    "specific_precautions": ["string"],
    "alternative_treatments_suggested": ["string"],
    "screening_complete": "boolean",
    "provider_reviewed": "boolean",
    "reviewed_at": "timestamp",
    "created_at": "timestamp"
  }
}
```

## User Actions

### Primary Actions
1. **Answer Screening Questions**
   - Toggle Yes/No for each question
   - Required to answer all questions
   - Can change answers before submission

2. **View Condition Details**
   - Tap "Learn more" for explanations
   - Understand why each matters
   - See alternative options

3. **Continue (if safe)**
   - Only enabled if no absolute contraindications
   - May show "Pending provider review"
   - Navigation: → Goal Setting (S09)

4. **Contact Provider (if unsafe)**
   - Direct call button
   - Schedule consultation
   - Request alternative treatment

### Secondary Actions
1. **Back Navigation**
   - Returns to Comorbidity Assessment (S07)
   - Warns about unsaved changes

2. **Save and Exit**
   - For complex medical situations
   - Allows consultation before continuing
   - Resume later functionality

3. **Emergency Information**
   - When to seek immediate care
   - Warning signs to watch for
   - Emergency contact numbers

## Validation Rules

### Required Responses
- All questions must be answered
- Cannot skip any safety questions
- Explicit Yes/No required (no defaults)

### Contraindication Logic
```javascript
const absoluteContraindications = [
  'thyroid_cancer_history',
  'multiple_endocrine_neoplasia',
  'pregnancy',
  'severe_gastroparesis',
  'active_pancreatitis'
];

const relativeContraindications = [
  'egfr_30_60',
  'moderate_liver_disease',
  'diabetic_retinopathy',
  'history_pancreatitis',
  'heavy_alcohol_use'
];
```

### Safety Flags
1. **Immediate Stop**
   - Pregnancy or breastfeeding
   - Active thyroid cancer
   - MEN 2 syndrome
   - eGFR < 30 (for metformin)

2. **Provider Review Required**
   - History of pancreatitis
   - Moderate kidney disease
   - Active substance use
   - Severe diabetic retinopathy

3. **Enhanced Monitoring**
   - Mild gastroparesis
   - Controlled IBD
   - Recent surgery
   - Eating disorder history

## Business Rules

1. **Risk Stratification**
   ```javascript
   const calculateRiskLevel = (contraindications) => {
     if (contraindications.absolute.length > 0) return 'contraindicated';
     if (contraindications.relative.length > 2) return 'high';
     if (contraindications.relative.length > 0) return 'moderate';
     return 'low';
   };
   ```

2. **Treatment Pathways**
   - Absolute contraindication → Alternative treatment
   - Relative contraindication → Specialist clearance
   - Low risk → Standard protocol
   - Moderate risk → Enhanced monitoring

3. **Documentation Requirements**
   - All positive responses documented
   - Provider must acknowledge reviews
   - Patient education provided
   - Informed consent updated

## Error Handling

### Safety Warnings
```json
{
  "warnings": {
    "absolute": {
      "title": "Treatment Not Recommended",
      "message": "Based on your responses, this medication may not be safe for you.",
      "actions": ["contact_provider", "explore_alternatives"]
    },
    "relative": {
      "title": "Additional Review Needed",
      "message": "Your provider needs to review your responses before proceeding.",
      "actions": ["save_progress", "schedule_consultation"]
    }
  }
}
```

### User Guidance
- Clear explanations for each contraindication
- Next steps clearly outlined
- Alternative options presented
- Support resources provided

## Analytics & Tracking

### Events to Track
- `screen_view`: Contraindication Screening displayed
- `question_answered`: Each Yes/No response
- `contraindication_detected`: Type and severity
- `info_accessed`: Educational content viewed
- `provider_contacted`: From safety warning
- `screening_completed`: Pass/fail status

### Clinical Metrics
- Contraindication prevalence by type
- Screen failure rate
- Provider override frequency
- Time to complete screening
- Patient safety incidents

## Clinical Decision Support

### Automated Alerts
1. **Provider Notifications**
   - High-risk patients flagged
   - Contraindications summarized
   - Suggested alternatives provided

2. **Patient Education**
   - Why screening matters
   - Risk explanations in plain language
   - Alternative treatment options

3. **Clinical Pathways**
   - Automatic routing based on risk
   - Specialist referral triggers
   - Follow-up scheduling

### Override Protocols
- Provider can override relative contraindications
- Requires documented rationale
- Enhanced monitoring automatically applied
- Patient informed consent required

## Accessibility Requirements

### Safety-Critical Accessibility
- High contrast for warnings
- Audio alerts for critical messages
- Clear action buttons
- No timeout on safety screens

### Screen Reader Support
- All warnings announced
- Question context preserved
- Current answer state vocalized
- Navigation cues provided

### Cognitive Load Management
- One question visible at a time (mobile)
- Clear Yes/No choices
- Plain language used
- Examples provided where helpful

## Platform Considerations

### iOS
- Critical alerts use system notifications
- Face ID before proceeding (if enabled)
- HealthKit data for kidney function

### Android
- Material Design warning patterns
- Biometric confirmation option
- Google Fit health data integration

## Integration Points

### Clinical Systems
1. **Lab Integration**
   - Pull recent eGFR values
   - Import liver function tests
   - Verify pregnancy tests

2. **Pharmacy Systems**
   - Check current medications
   - Flag drug interactions
   - Verify contraindications

### Provider Tools
1. **Clinical Dashboard**
   - Real-time safety alerts
   - Override capabilities
   - Documentation tools

2. **Risk Assessment Engine**
   - Calculate composite risk
   - Suggest protocols
   - Track outcomes

## Compliance & Legal

### Regulatory Requirements
- FDA safety requirements met
- Document all screening
- Maintain audit trail
- Patient consent for treatment

### Liability Management
- Clear documentation of risks
- Patient acknowledgment required
- Provider review documented
- Alternative options offered

## Success Metrics
- Screening completion rate > 99%
- Appropriate contraindication detection
- No adverse events from missed contraindications
- Provider satisfaction with screening
- Patient understanding of risks

## Technical Notes
- Implement session timeout warnings
- Store responses encrypted
- Real-time provider notifications
- Support for telemedicine review
- Integration with electronic consent platform