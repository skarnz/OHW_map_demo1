# Module Viewer Screen Specification

## Screen Overview
**Screen ID**: S21  
**Screen Name**: Module Viewer  
**Type**: Education - Content Display  
**Purpose**: Display individual educational modules with interactive content, progress tracking, and multimedia support. Provides engaging learning experience for weight management education.

## Visual Design

### Layout Structure
- Header with module title and progress
- Content area with scrollable lesson
- Media player for videos/audio
- Interactive elements zone
- Navigation controls
- Progress indicator

### UI Components

1. **Header Section**
   - Back arrow navigation
   - Module title (truncated if long)
   - Module number (e.g., "Module 3 of 12")
   - Progress bar (lesson completion)
   - Bookmark/Save icon

2. **Content Display Area**
   
   **A. Text Content**
   - Clean, readable typography
   - Section headers with icons
   - Bullet points and numbered lists
   - Highlighted key concepts
   - Expandable sections
   
   **B. Media Elements**
   - Video player with controls
   - Audio player for podcasts
   - Image galleries with captions
   - Infographics (zoomable)
   - Interactive diagrams
   
   **C. Interactive Components**
   - Knowledge check questions
   - Reflection prompts
   - Goal setting exercises
   - Food/activity calculators
   - Quick polls/surveys

3. **Navigation Controls**
   - Previous/Next lesson buttons
   - Swipe gestures for navigation
   - Jump to section menu
   - Return to Education Hub

4. **Progress Tracking**
   - Lesson progress bar
   - Time spent indicator
   - Completion checkmarks
   - Points/badges earned
   - Next lesson preview

5. **Engagement Features**
   - Take notes button
   - Share insights option
   - Ask question link
   - Related resources
   - Download materials

## Data Requirements

### Input Data
- Module ID and metadata
- User progress data
- Completion status
- Notes and bookmarks
- Quiz responses

### Display Data
```json
{
  "module": {
    "id": "string",
    "title": "string",
    "category": "nutrition|exercise|behavior|medical",
    "moduleNumber": "number",
    "totalModules": "number",
    "estimatedTime": "minutes",
    "content": {
      "sections": [{
        "id": "string",
        "type": "text|video|audio|interactive",
        "title": "string",
        "content": "html/markdown",
        "media": {
          "type": "video|audio|image",
          "url": "string",
          "duration": "seconds",
          "thumbnail": "url"
        },
        "interactive": {
          "type": "quiz|calculator|reflection",
          "data": {}
        }
      }],
      "resources": [{
        "title": "string",
        "type": "pdf|link|video",
        "url": "string"
      }]
    },
    "progress": {
      "completed": "boolean",
      "percentComplete": "number",
      "timeSpent": "minutes",
      "lastAccessed": "datetime",
      "sectionsCompleted": ["sectionIds"],
      "score": "number"
    },
    "engagement": {
      "notes": [{
        "sectionId": "string",
        "content": "string",
        "timestamp": "datetime"
      }],
      "bookmarked": "boolean",
      "questionsAsked": "number"
    }
  }
}
```

### Real-time Updates
- Progress synchronization
- Note saving
- Bookmark status
- Completion tracking

## User Actions

### Primary Actions
1. **Content Navigation**
   - Scroll through content
   - Play/pause media
   - Navigate sections
   - Complete interactions

2. **Progress Tracking**
   - Auto-save progress
   - Mark as complete
   - Track time spent
   - Earn achievements

3. **Engagement Actions**
   - Take notes
   - Save bookmarks
   - Answer questions
   - Complete exercises

### Secondary Actions
1. **Resource Access**
   - Download PDFs
   - Open external links
   - Save for offline
   - Print materials

2. **Social Features**
   - Share achievements
   - Ask questions
   - View discussions
   - Rate content

## Navigation Flow

### Entry Points
- Education Hub module list
- Dashboard recommendations
- Notification deep links
- Search results

### Exit Points
- Back to Education Hub
- Next module
- Knowledge check
- Profile/achievements

### Navigation Map
```
Education Hub → Module Viewer → Knowledge Check
                            → Next Module
                            → Resources
                            → Notes
                            → Education Hub
```

## Business Rules

1. **Content Access**
   - Sequential unlocking optional
   - Prerequisites enforcement
   - Time-gated content
   - Premium content flags

2. **Progress Tracking**
   - Auto-save every 30 seconds
   - Minimum time requirements
   - Completion criteria
   - Partial credit allowed

3. **Media Playback**
   - Auto-pause on exit
   - Resume from position
   - Offline availability
   - Bandwidth optimization

4. **Engagement Rules**
   - Required interactions
   - Points calculation
   - Achievement triggers
   - Certificate eligibility

## Error Handling

1. **Content Loading**
   - Offline content caching
   - Progressive loading
   - Fallback content
   - Retry mechanisms

2. **Media Failures**
   - Alternative formats
   - Transcript availability
   - Error messaging
   - Report issue option

## Performance Optimization

1. **Content Delivery**
   - CDN distribution
   - Adaptive streaming
   - Image optimization
   - Lazy loading

2. **Offline Support**
   - Download for offline
   - Sync when connected
   - Storage management
   - Update notifications

## Analytics & Tracking

### Events to Track
- Module start/complete
- Section completion time
- Media engagement
- Interaction completion
- Drop-off points
- Resource downloads

### Key Metrics
- Completion rates
- Time per module
- Engagement score
- Knowledge retention
- User satisfaction

## Platform-Specific Considerations

### iOS
- Picture-in-picture video
- AirPlay support
- Dynamic Type support
- VoiceOver compatibility

### Android
- Picture-in-picture video
- Cast support
- Multi-window mode
- TalkBack support

## Accessibility Requirements
- Screen reader support
- Closed captions for videos
- Audio descriptions
- Keyboard navigation
- High contrast mode
- Text size adjustment

## Success Metrics
- Module completion rate
- Average engagement time
- Knowledge check scores
- Content effectiveness
- User satisfaction ratings