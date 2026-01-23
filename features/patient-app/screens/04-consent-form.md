# Consent Form Screen Specification

## Screen Overview
**Screen ID**: S04  
**Screen Name**: Consent Form  
**Type**: Onboarding - Legal/Medical Consent  
**Purpose**: Present program terms, obtain informed consent for treatment, and ensure legal compliance for the OHW Weight Management Program including GLP-1 medication use.

## Visual Design

### Layout Structure
- Navigation bar with back button
- Progress indicator (Step 3 of 5)
- Scrollable consent document container
- Consent checkboxes at bottom
- Action buttons
- Digital signature component

### UI Components
1. **Header Section**
   - Back navigation arrow
   - Progress bar showing 60% complete
   - Step indicator: "Step 3 of 5: Program Consent"

2. **Document Viewer**
   - Scrollable text container with:
     - Program overview
     - Treatment description
     - Risks and benefits
     - Privacy practices
     - Financial responsibilities
   - Section headers for easy navigation
   - Zoom controls for accessibility

3. **Consent Sections** (Must scroll to view)
   
   **A. Program Participation**
   - "I understand this is a 12-month medical weight management program"
   - "I agree to attend scheduled visits and follow treatment plans"
   - "I understand results vary and are not guaranteed"

   **B. Medical Treatment**
   - "I consent to medical evaluation and treatment"
   - "I understand medications may be prescribed"
   - "I will report side effects immediately"
   - "I am not pregnant and will notify if status changes"

   **C. GLP-1 Specific (if applicable)**
   - "I understand the risks and benefits of GLP-1 medications"
   - "I will follow injection instructions and storage requirements"
   - "I understand insurance may not cover medications"

   **D. Data and Privacy**
   - "I consent to collection and use of health data"
   - "I understand how my data will be protected"
   - "I agree to receive program communications"

   **E. Financial Agreement**
   - "I understand program costs and payment terms"
   - "I acknowledge refund and cancellation policies"
   - "I accept responsibility for charges not covered by insurance"

4. **Acknowledgment Checkboxes** (Bottom of document)
   - [ ] "I have read and understood all consent information"
   - [ ] "I agree to all terms and conditions"
   - [ ] "I consent to treatment including medications if prescribed"
   - [ ] "I authorize release of medical information as needed"

5. **Digital Signature**
   - Signature pad or typed name field
   - Date/timestamp (auto-filled)
   - "Clear" and "Undo" options

6. **Action Buttons**
   - "Review Document" (opens full PDF)
   - "I Agree & Sign" (primary, disabled until requirements met)
   - "I Need to Think About It" (secondary)

## Data Requirements

### Input Data
- User ID from session
- Consent document version
- Device/browser information

### Output Data
```json
{
  "userId": "string",
  "consentRecord": {
    "documentVersion": "string",
    "documentHash": "string",
    "consentedSections": {
      "programParticipation": "boolean",
      "medicalTreatment": "boolean",
      "glp1Specific": "boolean",
      "dataPrivacy": "boolean",
      "financialAgreement": "boolean"
    },
    "acknowledgments": {
      "readAndUnderstood": "boolean",
      "agreeToTerms": "boolean",
      "consentToTreatment": "boolean",
      "authorizeRelease": "boolean"
    },
    "signature": {
      "type": "drawn|typed",
      "data": "base64_string|text",
      "signedAt": "timestamp",
      "ipAddress": "string",
      "deviceInfo": "object"
    },
    "scrollDepth": "percentage",
    "timeOnPage": "seconds"
  }
}
```

### Validation Rules
- Must scroll through entire document
- All checkboxes must be checked
- Signature must be provided
- Minimum time on page (fraud prevention)

## User Actions

### Primary Actions
1. **Read Consent Document**
   - Scroll through content
   - Pinch to zoom
   - Track scroll progress

2. **Check Consent Boxes**
   - Individual section consent
   - Enable signature when complete

3. **Provide Signature**
   - Draw signature (touch/stylus)
   - Or type full name
   - Clear and retry options

4. **Submit Consent**
   - Validate all requirements
   - Store consent record
   - Navigation: → Goal Setting (S05)

### Secondary Actions
1. **Review Full Document**
   - Open PDF version
   - Download option
   - Print option

2. **Need to Think**
   - Save progress
   - Send document via email
   - Return later to complete

3. **Back Navigation**
   - Confirm if partially completed
   - Navigation: → Health History (S03)

## Navigation Flow

### Entry Points
- Health History (S03)
- Resume from saved state
- Re-consent for updates

### Exit Points
- Goal Setting (S05) - success path
- Health History (S03) - back
- Dashboard - think about it

### Special Flows
- **Version Updates**: If consent version changed, require re-consent
- **Partial Consent**: Cannot proceed without full consent

## Business Rules

1. **Legal Requirements**
   - Must view entire document
   - Cannot proceed without all consents
   - Maintain audit trail
   - Store consent permanently

2. **Document Versioning**
   - Track consent version
   - Re-consent for material changes
   - Maintain version history

3. **Signature Validation**
   - Drawn: Minimum complexity
   - Typed: Must match account name
   - Timestamp and IP recorded

4. **Age Verification**
   - Confirm 18+ from previous data
   - Parental consent not supported

## Error Handling

1. **Signature Failures**
   - Clear instructions for retry
   - Alternative input methods
   - Technical support option

2. **Network Issues**
   - Cache consent locally
   - Retry submission
   - Confirm when synced

3. **Validation Errors**
   - Highlight missing items
   - Scroll to first error
   - Clear messaging

## Legal & Compliance

1. **HIPAA Compliance**
   - Secure transmission
   - Encrypted storage
   - Access logging

2. **State Requirements**
   - Adjust content by state
   - Telemedicine consent
   - Prescription requirements

3. **Audit Trail**
   - Complete interaction log
   - Tamper-proof storage
   - Regular compliance audits

## Analytics & Tracking

### Events to Track
- Document scroll depth
- Time to complete sections
- Checkbox interaction order
- Signature attempts
- Abandonment points
- "Think about it" usage

### Compliance Metrics
- Consent completion rate
- Average time to consent
- Version acceptance rates
- Re-consent success

## Platform-Specific Considerations

### iOS
- Apple Pencil support for iPad
- Touch ID/Face ID for identity
- Native PDF viewer

### Android
- Stylus support for tablets
- Biometric authentication
- Intent handling for PDF

## Mockup References
- **DocuSign**: Digital signature UX
- **Healthcare apps**: Consent best practices
- **Progressive consent**: Step-by-step approach

## Success Metrics
- Consent completion rate
- Time to complete
- Document interaction depth
- Signature success rate
- Legal compliance rate

## Technical Notes
- PDF generation for records
- Blockchain option for tamper-proof storage
- Integrate with document management system
- Support for accessibility readers
- Multi-language support requirements
- Offline consent with sync capability