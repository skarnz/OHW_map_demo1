# Account Creation Screen Specification

## Screen Overview
**Screen ID**: S02  
**Screen Name**: Account Creation  
**Type**: Onboarding - Registration  
**Purpose**: Collect essential user information to create a new OHW account and establish initial user profile.

## Visual Design

### Layout Structure
- Navigation bar with back button
- Progress indicator (Step 1 of 5)
- Form container with input fields
- Continue button (disabled until form valid)
- Terms and privacy policy links

### UI Components
1. **Header Section**
   - Back navigation arrow
   - Progress bar showing 20% complete
   - Step indicator: "Step 1 of 5: Create Account"

2. **Form Fields**
   - First Name* (text input)
   - Last Name* (text input)
   - Email Address* (email input)
   - Phone Number* (tel input with formatting)
   - Password* (secure text input)
   - Confirm Password* (secure text input)
   - Date of Birth* (date picker)
   - Gender (select dropdown: Male/Female/Other/Prefer not to say)

3. **Password Requirements Display**
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 number
   - At least 1 special character
   - Visual indicators for met/unmet requirements

4. **Legal Agreements**
   - Checkbox: "I agree to the Terms of Service and Privacy Policy"
   - Links to full documents

5. **Action Button**
   - "Continue" (enabled when form valid)

## Data Requirements

### Input Data
- User-entered form fields
- Device ID for security
- Referral code (if applicable from previous screen)

### Output Data
- User account object:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "password": "encrypted_string",
    "dateOfBirth": "YYYY-MM-DD",
    "gender": "string",
    "accountCreatedAt": "timestamp",
    "deviceId": "string",
    "referralCode": "string"
  }
  ```

### Validation Rules
- Email: Valid format, not already registered
- Phone: Valid US format (XXX) XXX-XXXX
- Password: Meets all security requirements
- Age: Must be 18+ years old
- All required fields completed

## User Actions

### Primary Actions
1. **Fill Form Fields**
   - Real-time validation feedback
   - Auto-format phone number
   - Show/hide password toggle

2. **Tap Continue**
   - Validate all fields
   - Create account via API
   - Navigation: → Health History (S03)

### Secondary Actions
1. **Tap Back**
   - Show confirmation dialog if form has data
   - Navigation: → Welcome Screen (S01)

2. **Tap Terms/Privacy Links**
   - Open in web view or modal
   - Track legal document views

3. **Tap "Already have account?"**
   - Navigation: → Login Screen

## Navigation Flow

### Entry Points
- Welcome Screen (S01)
- Deep link for registration

### Exit Points
- Health History (S03) - success path
- Welcome Screen (S01) - back navigation
- Login Screen - existing user

## Business Rules

1. **Email Uniqueness**
   - Check against existing accounts
   - Suggest password reset if email exists

2. **Age Verification**
   - Calculate age from DOB
   - Must be 18+ to create account
   - Show appropriate error message

3. **Password Security**
   - Enforce strong password rules
   - No common passwords allowed
   - Password strength indicator

4. **Phone Verification**
   - Format validation only at this step
   - SMS verification in later step

## Error Handling

1. **Network Errors**
   - Show retry option
   - Cache form data locally
   - "No internet connection" message

2. **API Errors**
   - Email already exists: Suggest login
   - Server error: Generic message with retry
   - Validation errors: Field-specific messages

3. **Form Errors**
   - Inline validation messages
   - Focus on first error field
   - Clear error on field edit

## Security Considerations

1. **Password Handling**
   - Never store plain text
   - Use secure text fields
   - Hash before transmission

2. **Data Transmission**
   - HTTPS only
   - Certificate pinning
   - Encrypt sensitive data

3. **Account Security**
   - Rate limiting on creation attempts
   - CAPTCHA after failed attempts
   - Email verification required

## Analytics & Tracking

### Events to Track
- `screen_view`: Account Creation displayed
- `form_start`: User begins entering data
- `field_completed`: Each field completion
- `validation_error`: Type and field
- `account_created`: Success event
- Form abandonment rate

### User Properties
- Account creation source
- Time to complete form
- Validation error count

## Platform-Specific Considerations

### iOS
- Use native date picker
- Keyboard management for form flow
- Autofill support for contact info

### Android
- Material Design text fields
- Handle keyboard visibility
- Support for autofill framework

## Mockup References
- **Noom**: Progressive disclosure in onboarding
- **MyFitnessPal**: Simple, clear form design
- **Modern form patterns**: Floating labels, inline validation

## Success Metrics
- Form completion rate
- Time to completion
- Error rate by field
- Drop-off points
- Successful account creation rate

## Technical Notes
- Implement proper keyboard navigation
- Support for password managers
- Form state persistence
- Accessibility labels for all fields
- Support for internationalization