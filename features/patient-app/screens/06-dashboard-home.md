# Dashboard/Home Screen Specification

## Screen Overview
**Screen ID**: S06  
**Screen Name**: Dashboard/Home  
**Type**: Main App - Primary Navigation Hub  
**Purpose**: Central hub providing at-a-glance progress overview, quick access to daily tasks, and navigation to all major app features. Primary screen users see after login.

## Visual Design

### Layout Structure
- Status bar with notifications badge
- Greeting header with user name and date
- Progress summary cards
- Quick action buttons
- Daily tasks checklist
- Bottom navigation bar

### UI Components

1. **Header Section**
   - Greeting: "Good [morning/afternoon/evening], [FirstName]!"
   - Current date and program day (e.g., "Day 45 of 365")
   - Notification bell icon with badge
   - Profile picture (tap for settings)

2. **Progress Summary Cards** (Scrollable carousel)
   
   **A. Weight Progress Card**
   - Current weight: [X] lbs
   - Change indicator: ↓ [Y] lbs
   - Mini graph (last 7 days)
   - "Update Weight" button
   - Next weigh-in reminder

   **B. Goals Progress Card**
   - Primary goal status
   - Progress bar: [Z]% to goal
   - Milestone achievements
   - "View All Goals" link

   **C. Streak Card**
   - Current streak: [N] days
   - Tracking compliance %
   - Visual calendar heat map
   - Motivational message

   **D. Weekly Summary Card** (if applicable)
   - Upcoming appointment
   - Weekly check-in status
   - Tasks completed this week
   - "Prepare for Visit" link

3. **Quick Actions Grid** (2x2 or 2x3)
   - Log Food (meal icon)
   - Track Activity (fitness icon)
   - Take Photo (camera icon)
   - Add Weight (scale icon)
   - View Education (book icon)
   - Message Provider (chat icon)

4. **Daily Tasks Checklist**
   - "Today's Tasks" header with progress
   - [ ] Log breakfast
   - [ ] Log lunch  
   - [ ] Log dinner
   - [ ] Track weight (if scheduled)
   - [ ] Complete daily lesson
   - [ ] Log fitness minutes
   - [ ] Take medication (if applicable)
   - Progress indicator: [X/Y] completed

5. **Insights/Tips Section**
   - Daily tip or motivation
   - Personalized based on progress
   - Link to related education
   - Dismiss/Save option

6. **Bottom Navigation Bar**
   - Home (active)
   - Track
   - Progress  
   - Education
   - More

## Data Requirements

### Input Data
- User profile and preferences
- Latest measurements
- Goal progress data
- Task completion status
- Appointment schedule
- Notification settings

### Display Data
```json
{
  "dashboard": {
    "greeting": {
      "timeOfDay": "morning|afternoon|evening",
      "userName": "string",
      "programDay": "number",
      "date": "date"
    },
    "progressCards": {
      "weight": {
        "current": "number",
        "change": "number",
        "trend": "up|down|stable",
        "lastUpdated": "date",
        "graphData": [{date, value}]
      },
      "goals": {
        "primaryGoal": "string",
        "percentComplete": "number",
        "milestonesAchieved": "number",
        "nextMilestone": "string"
      },
      "streak": {
        "currentDays": "number",
        "complianceRate": "percentage",
        "calendarData": [{date, status}]
      },
      "weekly": {
        "nextAppointment": "datetime",
        "checkInStatus": "pending|complete",
        "tasksCompleted": "number"
      }
    },
    "dailyTasks": [{
      "id": "string",
      "title": "string",
      "completed": "boolean",
      "type": "food|weight|activity|education|medication"
    }],
    "insight": {
      "message": "string",
      "type": "tip|motivation|education",
      "relatedContent": "link"
    }
  }
}
```

### Real-time Updates
- Task completion status
- Weight/measurement changes
- New notifications
- Appointment reminders

## User Actions

### Primary Actions
1. **Quick Action Taps**
   - Navigate to respective features
   - Pre-filled with context
   - Track engagement

2. **Complete Daily Tasks**
   - Check off completed items
   - Navigate to task screens
   - Update progress in real-time

3. **View Progress Cards**
   - Tap for detailed views
   - Swipe between cards
   - Update measurements

### Secondary Actions
1. **Notifications**
   - Tap bell for notification center
   - Badge shows unread count
   - Quick actions from notifications

2. **Profile Access**
   - Tap profile picture
   - Navigate to settings/profile
   - Quick access to help

3. **Insights Interaction**
   - Save useful tips
   - Share achievements
   - Dismiss irrelevant content

## Navigation Flow

### Entry Points
- App launch (post-login)
- Onboarding completion
- Deep links from notifications

### Exit Points
- All bottom nav destinations
- Quick action destinations
- Profile/Settings
- Notification center

### Navigation Map
```
Dashboard → Food Tracking
         → Activity Tracking  
         → Progress Photos
         → Weight Entry
         → Education Hub
         → Provider Messaging
         → Profile/Settings
         → Detailed Progress Views
```

## Business Rules

1. **Data Freshness**
   - Weight data: Show if updated within 7 days
   - Highlight overdue measurements
   - Sync on app launch
   - Cache for offline viewing

2. **Task Management**
   - Reset daily at midnight local time
   - Carry over incomplete weight/photo tasks
   - Adaptive task scheduling
   - Medication reminders if applicable

3. **Personalization**
   - Greeting based on local time
   - Tips based on progress patterns
   - Celebrate milestones
   - Contextual quick actions

4. **Notification Logic**
   - Badge count = unread items
   - Priority ordering
   - Smart notification timing
   - Do not disturb respect

## Error Handling

1. **Data Loading**
   - Skeleton screens while loading
   - Cached data for offline
   - Pull-to-refresh gesture
   - Error state messaging

2. **Sync Failures**
   - Queue actions for retry
   - Show sync status
   - Manual sync option
   - Conflict resolution

## Performance Optimization

1. **Load Priorities**
   - Critical data first
   - Progressive enhancement
   - Lazy load images
   - Prefetch common actions

2. **Caching Strategy**
   - Local storage for offline
   - Smart cache invalidation
   - Background sync
   - Delta updates only

## Analytics & Tracking

### Events to Track
- Screen load time
- Card interaction rates
- Quick action usage
- Task completion patterns
- Time on screen
- Notification interactions

### Key Metrics
- Daily active users
- Task completion rate
- Feature engagement
- Session duration
- Return frequency

## Platform-Specific Considerations

### iOS
- Widget support for quick stats
- 3D Touch quick actions
- Dynamic Type support
- Haptic feedback

### Android
- Home screen widgets
- App shortcuts
- Material You theming
- Adaptive icons

## Mockup References
- **MyFitnessPal**: Clean dashboard with clear metrics
- **Noom**: Task-focused daily view
- **Fitbit**: Beautiful progress visualizations
- **Apple Health**: Card-based layout

## Success Metrics
- Daily engagement rate
- Task completion rate
- Quick action usage
- Time to first action
- Return visit frequency

## Technical Notes
- Implement smooth animations
- Support for dark mode
- Responsive layout for tablets
- Real-time sync with WebSocket
- Offline-first architecture
- Accessibility compliance