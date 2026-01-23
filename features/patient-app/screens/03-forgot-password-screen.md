# Forgot Password Screen Specification

## Overview
The Forgot Password Screen allows users to reset their password through email or SMS verification. It provides a secure, user-friendly process for account recovery.

## Screen Information
- **Screen ID**: FORGOT_PWD_001
- **Screen Name**: Forgot Password Screen
- **Parent Navigation**: Login Screen
- **Child Navigation**: Login Screen (after completion), Password Reset Confirmation

## UI Components

### Header
- **Back Button**: Return to Login Screen
- **Title**: "Reset Password"
- **Subtitle**: "Enter your email or phone number and we'll send you instructions to reset your password"

### Step 1: Account Identification

#### Email/Phone Field
- **Field Type**: Text Input
- **Label**: "Email or Phone Number"
- **Placeholder**: "Enter email or phone"
- **Required**: Yes
- **Validation Rules**:
  - Email format: Valid email structure
  - Phone format: Valid phone number (10 digits US)
- **Error Messages**:
  - "Please enter a valid email or phone number"
  - "This field is required"
  - "No account found with this email/phone"

#### Send Reset Link Button
- **Type**: Primary Button
- **Text**: "Send Reset Instructions"
- **State Management**:
  - Disabled: When field is empty or invalid
  - Loading: Shows spinner during verification
  - Enabled: When valid input provided
- **Action**: Verify account and send reset instructions

### Step 2: Verification Code Entry (Conditional)

#### Instruction Text
- **Content**: "We've sent a 6-digit code to [masked_email/phone]"
- **Example**: "We've sent a 6-digit code to j***@gmail.com"

#### Verification Code Input
- **Field Type**: OTP Input (6 separate boxes)
- **Label**: "Enter Verification Code"
- **Features**:
  - Auto-focus next field on input
  - Paste support for full code
  - Numeric keyboard on mobile
- **Validation Rules**:
  - Exactly 6 digits
  - Valid code from backend
- **Error Messages**:
  - "Please enter all 6 digits"
  - "Invalid or expired code"

#### Resend Code Link
- **Type**: Text Link
- **Text**: "Didn't receive code? Resend"
- **Cooldown**: 60 seconds between resends
- **Display**: "Resend code in 45s" (countdown)

#### Verify Button
- **Type**: Primary Button
- **Text**: "Verify Code"
- **Action**: Validate code and proceed to password reset

### Step 3: New Password Creation

#### New Password Field
- **Field Type**: Password Input
- **Label**: "New Password"
- **Placeholder**: "Enter new password"
- **Required**: Yes
- **Features**:
  - Show/Hide toggle
  - Password strength meter
  - Requirements list (dynamic checkmarks)
- **Validation Rules**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
  - Cannot be same as last 3 passwords
- **Error Messages**:
  - "Password doesn't meet requirements"
  - "Cannot use recent password"

#### Confirm Password Field
- **Field Type**: Password Input
- **Label**: "Confirm New Password"
- **Placeholder**: "Re-enter new password"
- **Required**: Yes
- **Features**:
  - Show/Hide toggle
- **Validation Rules**:
  - Must match new password field
- **Error Messages**:
  - "Passwords do not match"

#### Reset Password Button
- **Type**: Primary Button
- **Text**: "Reset Password"
- **Action**: Submit new password and complete reset

### Success State

#### Success Message
- **Icon**: Green checkmark
- **Title**: "Password Reset Successful"
- **Message**: "Your password has been reset successfully. You can now sign in with your new password."

#### Return to Login Button
- **Type**: Primary Button
- **Text**: "Back to Login"
- **Action**: Navigate to Login Screen

## Navigation Flow

### Entry Points
- Login Screen (Forgot Password link)
- Deep link from email/SMS

### Exit Points
- **Cancel**: Back to Login Screen
- **Success**: Login Screen with success message
- **Timeout**: Return to Login after 5 minutes of inactivity

## Validation & Error Handling

### Account Verification Errors
- **Account Not Found**: "We couldn't find an account with that email/phone"
- **Account Locked**: "This account has been locked. Please contact support."
- **Too Many Attempts**: "Too many reset attempts. Please try again later."

### Code Verification Errors
- **Invalid Code**: "The code you entered is incorrect"
- **Expired Code**: "This code has expired. Please request a new one."
- **Max Attempts**: "Maximum verification attempts exceeded"

### Password Reset Errors
- **Network Error**: "Unable to reset password. Check your connection."
- **Server Error**: "Something went wrong. Please try again."
- **Token Expired**: "Reset link has expired. Please start over."

## Security Requirements

### Rate Limiting
- Maximum 3 reset attempts per hour per account
- Maximum 5 code verification attempts
- IP-based rate limiting for anonymous requests

### Code Security
- 6-digit numeric code
- Expires after 15 minutes
- Single use only
- Secure random generation

### Password Requirements
- Enforce strong password policy
- Check against common passwords list
- Prevent reuse of recent passwords
- Hash using bcrypt or Argon2

### Communication Security
- Mask email/phone in UI (show partial)
- Use secure links with tokens
- HTTPS only communication
- Clear sensitive data on navigation

## Accessibility

### Screen Reader Support
- Clear instructions at each step
- Announce errors and success states
- Proper field labeling
- Code input announces position

### Keyboard Navigation
- Tab through all fields logically
- Enter submits current step
- Escape returns to previous screen
- Arrow keys navigate code inputs

## Analytics Events

### Track Events
- `screen_view`: Forgot Password Screen Viewed
- `reset_requested`: Reset Instructions Sent
- `code_sent`: Verification Code Sent
- `code_verified`: Code Successfully Verified
- `password_reset`: Password Successfully Reset
- `reset_error`: Reset Process Failed

### Event Properties
- `method`: email/phone
- `step`: identification/verification/reset
- `error_type`: For failures
- `time_to_complete`: Total reset duration

## Communication Templates

### Email Template
```
Subject: Reset Your OHW Password

Hi [Name],

You requested to reset your password. Use the code below to verify your identity:

[123456]

This code expires in 15 minutes.

If you didn't request this, please ignore this email.

Best,
The OHW Team
```

### SMS Template
```
Your OHW password reset code is: 123456
This code expires in 15 minutes.
```

## Performance Requirements
- Account lookup: < 1 second
- Code sending: < 2 seconds
- Code verification: < 500ms
- Password reset: < 1 second

## Platform-Specific Considerations

### iOS
- Autofill support for SMS codes
- Keyboard type switching
- Deep link handling from Mail

### Android
- SMS retriever API integration
- Autofill for verification codes
- Chrome Custom Tabs for email links

### Web
- Copy-paste support for codes
- Browser password manager prompts
- Responsive design for all devices