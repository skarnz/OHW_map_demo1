# Welcome Screen (Onboarding Step 1) Specification

## Overview
The Welcome Screen is the first step of the onboarding process for new users. It introduces users to OHW's core value proposition and sets expectations for the personalization journey ahead.

## Screen Information
- **Screen ID**: ONBOARD_001
- **Screen Name**: Welcome Screen
- **Parent Navigation**: Registration Success, Login (first-time users)
- **Child Navigation**: Demographics Collection (Step 2)
- **Onboarding Step**: 1 of 7

## UI Components

### Header
- **Progress Bar**: Visual indicator showing step 1 of 7
- **Skip Button**: Top right, allows skipping entire onboarding
  - Text: "Skip"
  - Action: Navigate to Dashboard with default settings

### Hero Section

#### Welcome Animation
- **Type**: Lottie animation or illustrated graphic
- **Content**: Animated illustration showing health journey concept
- **Duration**: 3 seconds loop
- **Fallback**: Static illustration if animation fails

#### Welcome Message
- **Title**: "Welcome to OHW, [FirstName]!"
- **Subtitle**: "Your personalized health journey starts here"
- **Typography**: 
  - Title: 28pt, Bold
  - Subtitle: 16pt, Regular

### Content Sections

#### Value Propositions
- **Layout**: Vertical list with icons
- **Items**:
  1. **Personalized Care**
     - Icon: User with heart
     - Title: "Care Designed for You"
     - Description: "Get health recommendations tailored to your unique needs"
  
  2. **Expert Guidance**
     - Icon: Medical professional
     - Title: "Trusted Medical Experts"
     - Description: "Access verified health professionals and evidence-based care"
  
  3. **Track Progress**
     - Icon: Chart/Graph
     - Title: "Monitor Your Health"
     - Description: "Track symptoms, medications, and health improvements"
  
  4. **Community Support**
     - Icon: Group of people
     - Title: "You're Not Alone"
     - Description: "Connect with others on similar health journeys"

#### Onboarding Overview
- **Section Title**: "Let's Get Started"
- **Content**: "We'll ask you a few questions to personalize your experience. This takes about 5 minutes."
- **Steps Preview**: 
  - Visual indicator showing 7 dots/steps
  - Labels: "Basic Info → Health Profile → Goals → Preferences"

### Interactive Elements

#### Continue Button
- **Type**: Primary Button
- **Text**: "Start Personalization"
- **Width**: Full width with padding
- **Action**: Navigate to Demographics Collection
- **Animation**: Subtle pulse to draw attention

#### Privacy Notice
- **Type**: Info Box
- **Icon**: Lock/Shield icon
- **Text**: "Your information is private and secure"
- **Link**: "Learn more about our privacy practices"
- **Background**: Light blue/trust color

### Optional Features

#### Tutorial Video Link
- **Type**: Secondary Button or Link
- **Text**: "Watch 1-minute overview"
- **Icon**: Play button
- **Action**: Open video modal or player
- **Position**: Below main content

## Navigation Flow

### Entry Points
- Successful registration
- First login after account creation
- Returning to incomplete onboarding

### Exit Points
- **Continue**: Demographics Collection (Step 2)
- **Skip**: Dashboard with onboarding reminder
- **Back**: Not applicable (first step)

## State Management

### User State
- Mark user as "onboarding_started"
- Save timestamp of onboarding initiation
- Track if user viewed welcome screen

### Skip Functionality
- Show confirmation dialog: "Skip personalization? You can complete this later from your profile."
- Options: "Skip" / "Continue Setup"
- If skipped, show onboarding reminder on dashboard

## Accessibility

### Screen Reader Support
- Announce "Welcome to OHW" + user's name
- Read all value propositions in order
- Announce progress: "Step 1 of 7"
- Skip button clearly labeled

### Visual Accessibility
- High contrast mode support
- Minimum font size: 14pt
- Icon + text combinations for clarity
- Sufficient spacing between elements

### Motion Accessibility
- Respect "reduce motion" settings
- Provide static alternatives to animations
- No auto-playing videos

## Analytics Events

### Track Events
- `onboarding_started`: Welcome screen viewed
- `value_prop_viewed`: Time spent viewing each section
- `continue_clicked`: User proceeds to next step
- `skip_clicked`: User chooses to skip onboarding
- `privacy_link_clicked`: Privacy information accessed
- `video_played`: Tutorial video started

### Event Properties
- `session_id`: Unique onboarding session
- `user_type`: new/returning
- `time_on_screen`: Duration in seconds
- `interaction_count`: Number of taps/clicks

## Content Management

### Personalization
- Use user's first name from registration
- Adjust imagery based on user demographics (if available)
- A/B test different welcome messages

### Localization
- Support for multiple languages
- RTL layout support
- Culturally appropriate imagery
- Translated value propositions

## Performance Requirements

### Loading Performance
- Screen render: < 500ms
- Animation start: < 100ms after render
- All assets pre-loaded during registration

### Asset Optimization
- Illustrations: WebP format, < 50KB each
- Animations: Lottie files, < 100KB
- Lazy load video thumbnail

## Platform-Specific Considerations

### iOS
- Safe area considerations
- Haptic feedback on button press
- System font scaling support
- Dark mode support

### Android
- Material Design principles
- Back button handling (show exit confirmation)
- Adaptive icons
- Edge-to-edge display support

### Web
- Responsive breakpoints:
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+
- Progressive enhancement
- Keyboard navigation support

## A/B Testing Opportunities

### Test Variations
1. **Message Framing**
   - Health-focused vs. Wellness-focused
   - Professional vs. Friendly tone

2. **Visual Style**
   - Illustration vs. Photography
   - Animated vs. Static

3. **CTA Text**
   - "Start Personalization" vs. "Continue" vs. "Get Started"

4. **Skip Placement**
   - Top right vs. Bottom of screen
   - Visible vs. Hidden until scroll

### Success Metrics
- Onboarding completion rate
- Time to complete onboarding
- Skip rate
- Return rate after skip