# Welcome Screen Specification

## Screen Overview
**Screen ID**: S01  
**Screen Name**: Welcome Screen  
**Type**: Onboarding - Entry Point  
**Purpose**: First screen users see when launching the app for the first time. Introduces the OHW Weight Management Program and provides entry points for new and returning users.

## Visual Design

### Layout Structure
- Full-screen background with gradient or lifestyle imagery
- Centered content container with:
  - OHW logo at top
  - Welcome message
  - Brief program description
  - Call-to-action buttons
  - Login link for existing users

### UI Components
1. **Logo Section**
   - OHW brand logo (centered)
   - Tagline: "Your Journey to Optimal Health"

2. **Welcome Message**
   - Primary heading: "Welcome to OHW"
   - Subheading: "Transform your health with personalized medical weight management"

3. **Program Benefits** (Optional carousel or bullet points)
   - "Physician-supervised care"
   - "Personalized meal plans"
   - "24/7 AI support"
   - "Track progress easily"

4. **Action Buttons**
   - Primary CTA: "Get Started" (prominent, full-width)
   - Secondary: "I have an account" (text link)

## Data Requirements

### Input Data
- None (entry screen)

### Output Data
- User selection (new vs existing user)
- Analytics event: screen_view
- Session initiation timestamp

## User Actions

### Primary Actions
1. **Tap "Get Started"**
   - Navigation: → Account Creation (S02)
   - Analytics: Track "onboarding_started" event

2. **Tap "I have an account"**
   - Navigation: → Login Screen (part of Auth flow)
   - Analytics: Track "login_selected" event

### Secondary Actions
1. **App Background/Resume**
   - Maintain screen state
   - Check for deep links

2. **Back Button (Android)**
   - Exit app with confirmation dialog

## Navigation Flow

### Entry Points
- App launch (first time)
- Logout redirect
- Deep link to onboarding

### Exit Points
- Account Creation (S02) - for new users
- Login Screen - for existing users
- App exit

## Business Rules

1. **First Launch Detection**
   - Check local storage for "hasCompletedOnboarding" flag
   - If true, redirect to Login Screen

2. **Deep Link Handling**
   - Support for marketing campaign links
   - Preserve referral codes for analytics

3. **Accessibility Requirements**
   - Minimum contrast ratio 4.5:1
   - Screen reader compatible
   - Font size minimum 16pt

## Error Handling

1. **Network Connectivity**
   - Not required for this screen
   - Pre-cache all assets

2. **Device Compatibility**
   - Detect unsupported OS versions
   - Show compatibility message if needed

## Analytics & Tracking

### Events to Track
- `screen_view`: Welcome Screen displayed
- `button_tap`: Get Started / Login selection
- `session_start`: New app session
- Time spent on screen

### User Properties
- First launch timestamp
- Referral source (if applicable)
- Device type and OS version

## Platform-Specific Considerations

### iOS
- Support for Dynamic Type
- Respect user's preferred color scheme
- Face ID/Touch ID prompt preparation

### Android
- Material Design guidelines
- Handle back button navigation
- Support for different screen densities

## Mockup References
Based on successful landing page patterns:
- **MyFitnessPal**: Clean, straightforward approach with clear value proposition
- **Noom**: Psychology-focused messaging about behavior change
- **Weight Watchers**: Strong brand presence with community emphasis

## Success Metrics
- Conversion rate: Welcome → Account Creation
- Time to action (first tap)
- Drop-off rate
- Return user login rate

## Technical Notes
- Implement lazy loading for images
- Preload next screen assets
- Support offline mode
- A/B testing framework for CTA variations