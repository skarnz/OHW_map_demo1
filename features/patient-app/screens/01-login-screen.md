# Login Screen Specification

## Overview
The Login Screen is the primary entry point for existing users to access the OHW Patient App. It provides secure authentication using email/phone and password credentials.

## Screen Information
- **Screen ID**: LOGIN_001
- **Screen Name**: Login Screen
- **Parent Navigation**: App Launch
- **Child Navigation**: Welcome Screen (after successful login), Registration Screen, Forgot Password Screen

## UI Components

### Header
- **Logo**: OHW logo centered at top
- **Title**: "Welcome Back"
- **Subtitle**: "Sign in to continue to your health journey"

### Form Fields

#### Email/Phone Field
- **Field Type**: Text Input
- **Label**: "Email or Phone Number"
- **Placeholder**: "Enter email or phone"
- **Required**: Yes
- **Validation Rules**:
  - Email format: Must contain @ and valid domain
  - Phone format: 10 digits (US format)
  - Real-time validation feedback
- **Error Messages**:
  - "Please enter a valid email or phone number"
  - "This field is required"

#### Password Field
- **Field Type**: Password Input
- **Label**: "Password"
- **Placeholder**: "Enter password"
- **Required**: Yes
- **Features**:
  - Show/Hide password toggle icon
  - Minimum 8 characters
- **Validation Rules**:
  - Required field
  - Minimum length: 8 characters
- **Error Messages**:
  - "Password is required"
  - "Invalid credentials"

### Interactive Elements

#### Remember Me Checkbox
- **Type**: Checkbox
- **Label**: "Remember me"
- **Default**: Unchecked
- **Behavior**: Stores encrypted credentials locally for 30 days

#### Forgot Password Link
- **Type**: Text Link
- **Text**: "Forgot Password?"
- **Position**: Right-aligned below password field
- **Action**: Navigate to Forgot Password Screen

#### Login Button
- **Type**: Primary Button
- **Text**: "Sign In"
- **State Management**:
  - Disabled: When form is invalid
  - Loading: Shows spinner during authentication
  - Enabled: When all fields are valid
- **Action**: Submit authentication request

#### Social Login Options (Optional)
- **Google Sign-In Button**
  - Icon: Google logo
  - Text: "Continue with Google"
- **Apple Sign-In Button** (iOS only)
  - Icon: Apple logo
  - Text: "Continue with Apple"

#### Registration Link
- **Type**: Text with Link
- **Text**: "Don't have an account? Sign Up"
- **Position**: Centered below login options
- **Action**: Navigate to Registration Screen

## Navigation Flow

### Entry Points
- App launch (first screen if not logged in)
- Logout action from any authenticated screen
- Session timeout redirect

### Exit Points
- **Success**: Welcome Screen (Onboarding Step 1) for new users or Dashboard for returning users
- **Forgot Password**: Forgot Password Screen
- **Registration**: Registration Screen

## Validation & Error Handling

### Field-Level Validation
- Real-time validation as user types
- Show error state with red border and error message
- Clear error state when user starts correcting

### Form-Level Validation
- Validate all fields before enabling submit button
- Show inline errors for each invalid field

### Authentication Errors
- **Invalid Credentials**: "Email/phone or password is incorrect"
- **Account Locked**: "Your account has been locked. Please contact support."
- **Network Error**: "Unable to connect. Please check your internet connection."
- **Server Error**: "Something went wrong. Please try again."

## Security Requirements

### Password Security
- Passwords must be sent over HTTPS
- No password should be stored in plain text
- Implement rate limiting (5 attempts per 15 minutes)
- Show CAPTCHA after 3 failed attempts

### Session Management
- Generate secure session token upon successful login
- Token expiration: 30 days (if remember me checked), 24 hours (default)
- Implement refresh token mechanism

## Accessibility

### Screen Reader Support
- All form fields have proper labels
- Error messages are announced
- Loading states are communicated
- Tab order follows logical flow

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Enter key submits form when focused on password field
- Tab order: Email → Password → Remember Me → Login Button

## Analytics Events

### Track Events
- `screen_view`: Login Screen Viewed
- `login_attempt`: Login Button Clicked
- `login_success`: Successful Authentication
- `login_error`: Authentication Failed
- `forgot_password_clicked`: Forgot Password Link Clicked
- `signup_clicked`: Sign Up Link Clicked
- `social_login_clicked`: Social Login Option Selected

### Event Properties
- `method`: email/phone/google/apple
- `remember_me`: true/false
- `error_type`: For login errors
- `session_duration`: Time spent on screen

## Performance Requirements
- Screen load time: < 1 second
- Form submission response: < 2 seconds
- Implement optimistic UI updates
- Cache static assets

## Platform-Specific Considerations

### iOS
- Support Face ID/Touch ID for returning users
- Apple Sign-In button required
- Keyboard type adjustments for email/phone

### Android
- Support biometric authentication
- Material Design compliance
- Back button handling

### Web
- Responsive design for all screen sizes
- Browser password manager integration
- Support for password autofill