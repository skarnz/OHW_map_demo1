# Registration Screen Specification

## Overview
The Registration Screen allows new users to create an account for the OHW Patient App. It collects essential information for account creation while maintaining a simple, user-friendly interface.

## Screen Information
- **Screen ID**: REG_001
- **Screen Name**: Registration Screen
- **Parent Navigation**: Login Screen, App Launch
- **Child Navigation**: Welcome Screen (Onboarding Step 1) after successful registration

## UI Components

### Header
- **Back Button**: Navigation to previous screen
- **Title**: "Create Account"
- **Subtitle**: "Join OHW to start your personalized health journey"
- **Progress Indicator**: Step 1 of 1

### Form Fields

#### Full Name Field
- **Field Type**: Text Input
- **Label**: "Full Name"
- **Placeholder**: "Enter your full name"
- **Required**: Yes
- **Validation Rules**:
  - Minimum 2 characters
  - Maximum 50 characters
  - Only letters, spaces, hyphens, and apostrophes
- **Error Messages**:
  - "Please enter your full name"
  - "Name must be at least 2 characters"
  - "Please use only letters and spaces"

#### Email Field
- **Field Type**: Email Input
- **Label**: "Email Address"
- **Placeholder**: "your@email.com"
- **Required**: Yes
- **Validation Rules**:
  - Valid email format
  - Email uniqueness check (async)
- **Error Messages**:
  - "Please enter a valid email address"
  - "This email is already registered"
  - "Email is required"

#### Phone Number Field
- **Field Type**: Phone Input
- **Label**: "Phone Number"
- **Placeholder**: "(555) 123-4567"
- **Required**: Yes
- **Features**:
  - Auto-format as user types
  - Country code selector (default: +1 US)
- **Validation Rules**:
  - Valid phone format for selected country
  - Uniqueness check (async)
- **Error Messages**:
  - "Please enter a valid phone number"
  - "This phone number is already registered"

#### Password Field
- **Field Type**: Password Input
- **Label**: "Create Password"
- **Placeholder**: "Create a strong password"
- **Required**: Yes
- **Features**:
  - Show/Hide toggle
  - Password strength indicator
  - Requirements tooltip
- **Validation Rules**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- **Error Messages**:
  - "Password must be at least 8 characters"
  - "Password must include uppercase, lowercase, number, and special character"

#### Confirm Password Field
- **Field Type**: Password Input
- **Label**: "Confirm Password"
- **Placeholder**: "Re-enter your password"
- **Required**: Yes
- **Features**:
  - Show/Hide toggle
- **Validation Rules**:
  - Must match password field
- **Error Messages**:
  - "Passwords do not match"
  - "Please confirm your password"

### Interactive Elements

#### Terms and Conditions Checkbox
- **Type**: Checkbox with Link
- **Label**: "I agree to the Terms of Service and Privacy Policy"
- **Required**: Yes
- **Links**: 
  - "Terms of Service" → Terms modal/screen
  - "Privacy Policy" → Privacy modal/screen
- **Error Message**: "You must agree to the terms to continue"

#### Marketing Communications Checkbox
- **Type**: Checkbox
- **Label**: "Send me helpful health tips and updates"
- **Required**: No
- **Default**: Unchecked

#### Create Account Button
- **Type**: Primary Button
- **Text**: "Create Account"
- **State Management**:
  - Disabled: When form is invalid or terms not accepted
  - Loading: Shows spinner during registration
  - Enabled: When all validations pass
- **Action**: Submit registration request

#### Social Registration Options (Optional)
- **Google Sign-Up Button**
  - Icon: Google logo
  - Text: "Sign up with Google"
- **Apple Sign-Up Button** (iOS only)
  - Icon: Apple logo
  - Text: "Sign up with Apple"

#### Login Link
- **Type**: Text with Link
- **Text**: "Already have an account? Sign In"
- **Position**: Centered below registration options
- **Action**: Navigate to Login Screen

## Navigation Flow

### Entry Points
- Login Screen (Sign Up link)
- App launch (if user selects "Create Account")
- Marketing landing pages

### Exit Points
- **Success**: Welcome Screen (Onboarding Step 1)
- **Cancel**: Back to Login Screen
- **Terms/Privacy**: Modal or dedicated screen

## Validation & Error Handling

### Real-Time Validation
- Email format validation on blur
- Password strength indicator updates as user types
- Phone number formatting
- Async uniqueness checks for email/phone

### Form Submission Validation
- All required fields must be filled
- All validation rules must pass
- Terms must be accepted
- Show summary of errors at top if multiple issues

### Registration Errors
- **Duplicate Account**: "An account with this email/phone already exists"
- **Network Error**: "Unable to create account. Please check your connection."
- **Server Error**: "Something went wrong. Please try again."
- **Validation Error**: Field-specific error messages

## Security Requirements

### Data Protection
- All data transmitted over HTTPS
- Password hashed using bcrypt or similar
- No sensitive data in local storage
- Implement CAPTCHA for bot protection

### Account Verification
- Send verification email upon registration
- Send SMS verification code for phone
- Allow access to limited features until verified

## Accessibility

### Screen Reader Support
- All form fields properly labeled
- Error messages announced
- Password requirements read aloud
- Terms and conditions links accessible

### Keyboard Navigation
- Logical tab order through all fields
- Enter key submits form when all fields valid
- Escape key cancels and returns to login

## Analytics Events

### Track Events
- `screen_view`: Registration Screen Viewed
- `registration_started`: User begins filling form
- `registration_attempted`: Create Account clicked
- `registration_success`: Account created successfully
- `registration_error`: Registration failed
- `terms_viewed`: Terms/Privacy links clicked
- `social_registration`: Social sign-up selected

### Event Properties
- `registration_method`: email/google/apple
- `marketing_opt_in`: true/false
- `error_type`: For registration failures
- `completion_time`: Time to complete form

## Data Handling

### Collected Data
```json
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "password": "hashed_string",
  "terms_accepted": "boolean",
  "marketing_opt_in": "boolean",
  "registration_method": "email|google|apple",
  "device_info": {
    "platform": "ios|android|web",
    "version": "string"
  },
  "timestamp": "ISO 8601"
}
```

### API Endpoints
- `POST /api/v1/auth/register` - Create new account
- `GET /api/v1/auth/check-email` - Check email availability
- `GET /api/v1/auth/check-phone` - Check phone availability

## Performance Requirements
- Field validation response: < 300ms
- Registration submission: < 3 seconds
- Implement debouncing for async checks
- Show progress during submission

## Platform-Specific Considerations

### iOS
- Apple Sign-Up required for App Store
- Keyboard types optimized per field
- Autofill support for contact info

### Android
- Material Design components
- Smart Lock for Passwords integration
- Proper back button handling

### Web
- Responsive design breakpoints
- Browser autofill compatibility
- Social login popup handling