# Demographics Collection (Onboarding Step 2) Specification

## Overview
The Demographics Collection screen gathers essential personal information to personalize the health experience and ensure appropriate medical recommendations. This screen balances comprehensive data collection with user privacy concerns.

## Screen Information
- **Screen ID**: ONBOARD_002
- **Screen Name**: Demographics Collection
- **Parent Navigation**: Welcome Screen (Step 1)
- **Child Navigation**: Health Conditions (Step 3)
- **Onboarding Step**: 2 of 7

## UI Components

### Header
- **Progress Bar**: Visual indicator showing step 2 of 7 (28% complete)
- **Back Button**: Return to Welcome Screen
- **Skip Button**: Skip to next step with confirmation dialog
  - Text: "Skip"
  - Dialog: "We use this information to provide personalized health recommendations. Skip anyway?"

### Screen Title Section
- **Title**: "Tell us about yourself"
- **Subtitle**: "This helps us provide relevant health information and connect you with the right care"
- **Privacy Badge**: Lock icon + "Your data is private and secure"

### Form Sections

#### Section 1: Basic Information

##### Date of Birth
- **Field Type**: Date Picker
- **Label**: "Date of Birth"
- **Format**: MM/DD/YYYY
- **Required**: Yes
- **Validation**:
  - Must be valid date
  - Age must be 18+ (or 13+ with guardian consent)
  - Cannot be future date
- **Error Messages**:
  - "Please enter a valid date"
  - "You must be 18 or older to use OHW"
- **UI Features**:
  - Calendar picker on mobile
  - Keyboard input option
  - Age display: "Age: 34 years"

##### Biological Sex
- **Field Type**: Radio Button Group
- **Label**: "Biological Sex at Birth"
- **Required**: Yes
- **Options**:
  - Male
  - Female
  - Intersex
  - Prefer not to answer
- **Helper Text**: "This helps us provide accurate health recommendations"
- **Layout**: Vertical list with icons

##### Gender Identity
- **Field Type**: Dropdown/Select
- **Label**: "Gender Identity"
- **Required**: No
- **Options**:
  - Woman
  - Man
  - Transgender Woman
  - Transgender Man
  - Non-binary
  - Gender Fluid
  - Other (with text input)
  - Prefer not to answer
- **Helper Text**: "How you identify yourself"

#### Section 2: Physical Characteristics

##### Height
- **Field Type**: Dual Input (feet/inches or cm)
- **Label**: "Height"
- **Required**: Yes
- **Features**:
  - Toggle between Imperial/Metric
  - Visual height indicator
- **Validation**:
  - Reasonable range: 3'0" - 8'0" (91cm - 244cm)
- **Error Messages**:
  - "Please enter a valid height"

##### Weight
- **Field Type**: Number Input
- **Label**: "Current Weight"
- **Required**: Yes
- **Features**:
  - Toggle between lbs/kg
  - Optional: "Prefer not to answer"
- **Validation**:
  - Reasonable range: 50-800 lbs (23-363 kg)
- **Helper Text**: "Used to calculate medication dosages and health metrics"

##### BMI Display (Auto-calculated)
- **Type**: Read-only field
- **Label**: "BMI"
- **Display**: Calculated value with category
- **Categories**: Underweight / Normal / Overweight / Obese
- **Note**: "BMI is just one health indicator"

#### Section 3: Cultural & Lifestyle

##### Race/Ethnicity
- **Field Type**: Multi-select Checkbox
- **Label**: "Race/Ethnicity (Select all that apply)"
- **Required**: No
- **Options**:
  - American Indian or Alaska Native
  - Asian
    - Chinese
    - Filipino
    - Indian
    - Japanese
    - Korean
    - Vietnamese
    - Other Asian
  - Black or African American
  - Hispanic or Latino
  - Middle Eastern or North African
  - Native Hawaiian or Pacific Islander
  - White
  - Other (with text input)
  - Prefer not to answer
- **Helper Text**: "Helps identify health risks specific to your background"

##### Primary Language
- **Field Type**: Dropdown with Search
- **Label**: "Preferred Language"
- **Required**: Yes
- **Default**: Based on device language
- **Common Options** (top of list):
  - English
  - Spanish
  - Chinese (Simplified)
  - Chinese (Traditional)
  - French
  - Arabic
  - Portuguese
  - Russian
  - [Full ISO language list]

##### Location
- **Field Type**: Text Input with Autocomplete
- **Label**: "City, State"
- **Required**: Yes
- **Features**:
  - Google Places autocomplete
  - Or manual entry
- **Purpose Note**: "Find healthcare providers in your area"
- **Privacy Note**: "We only store city and state"

### Interactive Elements

#### Why We Ask Link
- **Type**: Expandable Info Section
- **Icon**: Info circle
- **Content**: Detailed explanation of how each data point improves care
- **Categories**:
  - Medical accuracy
  - Cultural competence
  - Local resources
  - Risk assessment

#### Save Progress Button
- **Type**: Text Button
- **Text**: "Save and Exit"
- **Action**: Save current form state and return to dashboard
- **Note**: "You can complete this later"

#### Continue Button
- **Type**: Primary Button
- **Text**: "Continue"
- **State**:
  - Disabled: Required fields empty
  - Enabled: All required fields complete
- **Action**: Validate and proceed to Health Conditions

## Navigation Flow

### Entry Points
- Welcome Screen completion
- Return from Health Conditions (back)
- Resume from saved progress

### Exit Points
- **Continue**: Health Conditions (Step 3)
- **Back**: Welcome Screen
- **Skip**: Health Conditions with confirmation
- **Save & Exit**: Dashboard with progress saved

## Data Privacy & Security

### Sensitive Data Handling
- All demographic data encrypted at rest
- HIPAA-compliant storage
- No data shared without explicit consent
- Clear data retention policy displayed

### Optional Fields
- Clearly mark required vs. optional
- Explain benefit of providing optional data
- Never penalize for "prefer not to answer"

### Consent Management
- Link to privacy policy
- Data usage explanation
- Option to update/delete data later

## Validation & Error Handling

### Field-Level Validation
- Validate on blur for each field
- Show inline errors below fields
- Clear error when corrected

### Form-Level Validation
- Prevent submission with errors
- Scroll to first error field
- Show error summary if multiple issues

### Error Recovery
- Auto-save progress every 30 seconds
- Restore form state on app crash
- Show "Draft saved" indicator

## Accessibility

### Screen Reader Support
- Proper field labels and descriptions
- Error announcements
- Progress updates
- Group related fields

### Keyboard Navigation
- Tab order follows visual layout
- Enter key advances to next field
- Escape key shows exit confirmation

### Visual Accessibility
- Color-blind friendly design
- High contrast option
- Scalable text (up to 200%)
- Touch targets minimum 44x44pt

## Analytics Events

### Field Interaction
- `field_focused`: Track which fields users interact with
- `field_completed`: Track completion rates
- `field_skipped`: Track skip patterns
- `option_selected`: Track selections for analysis

### Form Progress
- `demographics_started`: Form view initiated
- `demographics_progress`: % of form completed
- `demographics_completed`: All fields submitted
- `demographics_abandoned`: User left without completing

### Privacy Interactions
- `privacy_info_viewed`: "Why we ask" expanded
- `skip_confirmed`: User skipped after seeing dialog
- `data_usage_viewed`: Privacy policy accessed

## Platform-Specific Considerations

### iOS
- Native date picker
- Height picker with scroll wheels
- Location services permission handling
- Keyboard avoidance for form fields

### Android
- Material Design date picker
- Number picker for height/weight
- Location autocomplete with permissions
- Back button saves progress

### Web
- HTML5 input types
- Accessible date picker library
- Address autocomplete fallback
- Session storage for progress

## Localization

### Multi-language Support
- Translate all labels and helper text
- Localize date formats (MM/DD vs DD/MM)
- Localize units (imperial vs metric defaults)
- Cultural adaptation for sensitive questions

### Regional Variations
- Race/ethnicity options by region
- Height/weight units by locale
- Date picker format by culture
- Right-to-left language support

## Performance Optimization

### Load Time
- Lazy load location autocomplete
- Defer non-critical validations
- Progressive form rendering
- < 1 second initial render

### Data Efficiency
- Batch validation requests
- Cache common selections
- Minimize API calls
- Offline capability with sync