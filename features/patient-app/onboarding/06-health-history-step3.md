# Health History Screen Specification (Step 3)

## Screen Overview
**Screen ID**: S06  
**Screen Name**: Health History  
**Type**: Onboarding - Step 3  
**Purpose**: Collect comprehensive medical history including conditions, medications, allergies, and family history to ensure safe treatment and personalized care plans.

## Visual Design

### Layout Structure
- Fixed header with:
  - Back arrow navigation
  - Step indicator (3 of 7)
  - "Health History" title
- Scrollable form container with:
  - Section headers with icons
  - Expandable/collapsible sections
  - Input fields grouped by category
- Fixed footer with:
  - Progress indicator bar (43% complete)
  - "Continue" button

### UI Components
1. **Progress Indicator**
   - Visual stepper showing step 3 of 7
   - Progress bar at 43% completion

2. **Form Sections**
   - Each section has expand/collapse functionality
   - Required fields marked with asterisk (*)
   - Info icons for complex terms

3. **Input Types**
   - Multi-select checkboxes for conditions
   - Text inputs for "other" specifications
   - Toggle switches for yes/no questions
   - Searchable dropdowns for medications

## Data Requirements

### Input Data

#### 1. Medical Conditions Section
```json
{
  "medical_conditions": {
    "current_conditions": [
      "type_2_diabetes",
      "hypertension",
      "hyperlipidemia",
      "sleep_apnea",
      "thyroid_disorder",
      "pcos",
      "depression",
      "anxiety",
      "other"
    ],
    "other_conditions": "string" // If "other" selected
  }
}
```

#### 2. Current Medications Section
```json
{
  "current_medications": [
    {
      "name": "string",
      "dose": "string",
      "frequency": "string",
      "prescriber": "string"
    }
  ],
  "supplements": [
    {
      "name": "string",
      "dose": "string",
      "frequency": "string"
    }
  ]
}
```

#### 3. Allergies Section
```json
{
  "allergies": {
    "medication_allergies": ["string"],
    "food_allergies": ["string"],
    "environmental_allergies": ["string"],
    "no_known_allergies": "boolean"
  }
}
```

#### 4. Previous Weight Loss Attempts
```json
{
  "weight_loss_history": {
    "previous_programs": [
      {
        "program_name": "string",
        "duration": "string",
        "weight_lost": "number",
        "year": "number"
      }
    ],
    "previous_medications": [
      "phentermine",
      "orlistat",
      "semaglutide",
      "liraglutide",
      "naltrexone_bupropion",
      "other"
    ],
    "other_medications": "string"
  }
}
```

#### 5. Personal Medical History
```json
{
  "personal_history": {
    "coronary_artery_disease": "boolean",
    "hypertension": "boolean",
    "hyperlipidemia": "boolean",
    "diabetes": {
      "has_condition": "boolean",
      "type": "prediabetes|type1|type2|gestational"
    },
    "cancer": {
      "has_history": "boolean",
      "type": "string",
      "year_diagnosed": "number"
    },
    "tobacco_use": {
      "current": "boolean",
      "former": "boolean",
      "never": "boolean",
      "quit_date": "date" // If former
    }
  }
}
```

#### 6. Family Medical History
```json
{
  "family_history": {
    "coronary_artery_disease": {
      "present": "boolean",
      "relatives": ["mother", "father", "sibling", "grandparent"]
    },
    "hypertension": {
      "present": "boolean",
      "relatives": ["mother", "father", "sibling", "grandparent"]
    },
    "hyperlipidemia": {
      "present": "boolean",
      "relatives": ["mother", "father", "sibling", "grandparent"]
    },
    "diabetes": {
      "present": "boolean",
      "type": "type1|type2",
      "relatives": ["mother", "father", "sibling", "grandparent"]
    },
    "cancer": {
      "present": "boolean",
      "types": ["string"],
      "relatives": ["mother", "father", "sibling", "grandparent"]
    },
    "obesity": {
      "present": "boolean",
      "relatives": ["mother", "father", "sibling", "grandparent"]
    }
  }
}
```

### Output Data
```json
{
  "patient_health_history": {
    "id": "uuid",
    "patient_id": "uuid",
    "medical_conditions": ["string"],
    "current_medications": [{...}],
    "supplements": [{...}],
    "allergies": ["string"],
    "previous_weight_loss_attempts": "string",
    "personal_history": {...},
    "family_history": {...},
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

## User Actions

### Primary Actions
1. **Expand/Collapse Sections**
   - Tap section header to expand/collapse
   - Smooth animation transition
   - Section state persists during session

2. **Add Medication**
   - Tap "Add Medication" button
   - Search medication database
   - Auto-populate common doses
   - Manual entry option

3. **Select Conditions**
   - Tap checkboxes for multiple selections
   - "Other" option reveals text input
   - Info icons show condition descriptions

4. **Continue**
   - Validates all required fields
   - Saves data to database
   - Navigation: → Comorbidity Assessment (S07)

### Secondary Actions
1. **Back Navigation**
   - Returns to Demographics (S05)
   - Preserves entered data

2. **Save Progress**
   - Auto-save on field blur
   - Visual confirmation of saved state

3. **Help/Info**
   - Tap info icons for explanations
   - Medical term glossary

## Validation Rules

### Required Fields
- At least one response in medical conditions (even if "none")
- Allergy status (even if "no known allergies")
- Tobacco use status

### Field-Specific Validation
1. **Medications**
   - Name: Required, min 2 characters
   - Dose: Required, alphanumeric
   - Frequency: Required, predefined options

2. **Allergies**
   - If "No known allergies" checked, disable other fields
   - At least one allergy type if not "no known"

3. **Weight Loss History**
   - Year: Must be within last 20 years
   - Weight lost: Numeric, 0-500 lbs range

### Cross-Field Validation
- If diabetes in personal history, must specify type
- If cancer history, must provide type and year
- If former smoker, quit date required

## Business Rules

1. **Medical Database Integration**
   - Medication names from FDA database
   - Auto-suggest common doses/frequencies
   - Flag high-risk medication combinations

2. **Privacy Compliance**
   - All data encrypted in transit and at rest
   - Audit log entry for each save
   - HIPAA-compliant data handling

3. **Clinical Safety**
   - Highlight critical allergies in red
   - Alert for medication interactions
   - Flag contraindicated conditions

4. **Data Completeness**
   - Allow "Unknown" option for family history
   - Partial save capability
   - Resume from last saved state

## Error Handling

### Validation Errors
```json
{
  "errors": {
    "medications[0].name": "Medication name is required",
    "personal_history.cancer.type": "Please specify cancer type",
    "tobacco_use": "Please select tobacco use status"
  }
}
```

### Network Errors
- Offline capability with local storage
- Sync when connection restored
- Clear offline indicator

### Data Entry Errors
- Inline validation messages
- Highlight problematic fields
- Scroll to first error

## Analytics & Tracking

### Events to Track
- `screen_view`: Health History displayed
- `section_expanded`: Which sections opened
- `medication_added`: Count and types
- `condition_selected`: Which conditions checked
- `validation_error`: Which fields fail
- `form_completed`: Time to complete
- `help_accessed`: Which info buttons tapped

### Metrics
- Average completion time: Target < 5 minutes
- Drop-off points by section
- Most common conditions selected
- Medication entry patterns

## Data Storage

### Database Tables
1. **patient_health_history**
   - Primary storage for all history data
   - JSON fields for complex structures
   - Indexed on patient_id

2. **patient_medications** (normalized)
   - Separate table for current medications
   - Enables medication tracking over time

3. **patient_allergies** (normalized)
   - Categorized allergy storage
   - Searchable for clinical decisions

### Encryption
- All PHI fields encrypted at rest
- Separate encryption keys per patient
- Audit trail for all data access

## Accessibility Requirements

### Screen Reader Support
- All form fields properly labeled
- Section headers announced
- Required field indicators vocalized
- Error messages read automatically

### Visual Accessibility
- High contrast mode support
- Minimum 16pt font size
- Clear visual hierarchy
- Color-blind friendly indicators

### Motor Accessibility
- Large tap targets (44x44 minimum)
- Adequate spacing between inputs
- Support for external keyboards
- Voice input compatibility

## Platform Considerations

### iOS
- Use native iOS date picker for dates
- Support for medical terminology autocorrect
- Haptic feedback for selections

### Android
- Material Design form components
- Support for back gesture navigation
- Auto-fill from Google Health (if available)

## Integration Points

### External APIs
1. **FDA Drug Database**
   - Medication name validation
   - Common dosage suggestions
   - Drug interaction checks

2. **ICD-10 Lookup**
   - Condition code mapping
   - Insurance compatibility check

### Internal Services
1. **Patient Service**
   - Save health history data
   - Retrieve existing history

2. **Clinical Decision Support**
   - Flag high-risk combinations
   - Suggest follow-up questions

## Success Metrics
- Completion rate > 95%
- Average time to complete < 5 minutes
- Data quality score > 90%
- User satisfaction > 4.5/5

## Technical Notes
- Implement debounced auto-save
- Use React Hook Form for form management
- Lazy load medication database
- Cache common selections
- Support offline data entry with sync