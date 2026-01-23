# Education Hub Screen Specification

## Screen Overview
**Screen ID**: S09  
**Screen Name**: Education Hub  
**Type**: Main App - Learning Center  
**Purpose**: Central location for all educational content including weekly microlearning modules, video tutorials, articles, and the AI-powered Q&A system.

## Visual Design

### Layout Structure
- Search bar at top
- Featured content carousel
- Category navigation
- Content list/grid view
- Progress tracking indicators
- AI assistant access button

### UI Components

1. **Header Section**
   - Screen title: "Learn & Grow"
   - Search bar with filter icon
   - Notification badge for new content
   - Points/badges earned indicator

2. **Featured Content Carousel**
   - This week's module (highlighted)
   - Recommended based on progress
   - New content notifications
   - Quick video tips
   - Swipeable with indicators

3. **Quick Access Tabs**
   - My Learning Path
   - Browse All
   - Saved Items
   - AI Coach
   - Resources

4. **My Learning Path Tab**
   - **Current Week Module**
     - Module title and number (e.g., "Week 5: Meal Planning")
     - Progress bar (e.g., 2/5 lessons complete)
     - Time estimate (e.g., "15 min remaining")
     - "Continue Learning" button
   - **Upcoming Modules** (locked/preview)
     - Next 4 weeks visible
     - Topics preview
     - Unlock dates
   - **Completed Modules**
     - Checkmarks and scores
     - "Review" option
     - Earned badges

5. **Browse All Tab**
   - **Categories Grid**
     - Nutrition Basics
     - Exercise & Movement
     - Behavior Change
     - Medical Information
     - Recipes & Meal Ideas
     - Success Stories
     - FAQ Videos
   - **Content Types Filter**
     - Articles (5-10 min read)
     - Videos (2-15 min)
     - Podcasts (10-30 min)
     - Interactive Tools
     - Downloadable PDFs

6. **Content List Items**
   - Thumbnail image/icon
   - Title and description
   - Type indicator (video/article/etc)
   - Duration/length
   - Completion status
   - Save/bookmark option

7. **AI Coach Tab**
   - Welcome message
   - Suggested questions
   - Text input field
   - Recent conversations
   - "Ask Anything" prompt

8. **Individual Content View**
   - Full-screen reader/player
   - Progress tracking
   - Take notes feature
   - Related content
   - Quiz/comprehension check
   - Share/save options

## Data Requirements

### Content Structure
```json
{
  "educationContent": {
    "learningPath": {
      "currentWeek": "number",
      "currentModule": {
        "id": "string",
        "title": "string",
        "week": "number",
        "lessons": [{
          "id": "string",
          "title": "string",
          "type": "video|article|interactive",
          "duration": "minutes",
          "completed": "boolean",
          "completedAt": "datetime"
        }],
        "progress": "percentage",
        "points": "number"
      },
      "upcomingModules": [{
        "week": "number",
        "title": "string",
        "unlockDate": "date",
        "preview": "string"
      }],
      "completedModules": [{
        "id": "string",
        "week": "number",
        "title": "string",
        "score": "percentage",
        "completedAt": "date"
      }]
    },
    "allContent": [{
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "type": "video|article|podcast|tool|pdf",
      "duration": "minutes",
      "thumbnail": "url",
      "content": "url|text",
      "tags": ["array"],
      "difficulty": "beginner|intermediate|advanced"
    }],
    "userProgress": {
      "completedItems": ["array of ids"],
      "savedItems": ["array of ids"],
      "notes": [{
        "contentId": "string",
        "note": "string",
        "timestamp": "datetime"
      }],
      "quizScores": [{
        "contentId": "string",
        "score": "percentage",
        "attempts": "number"
      }]
    },
    "aiCoach": {
      "recentQuestions": [{
        "question": "string",
        "answer": "string",
        "timestamp": "datetime",
        "helpful": "boolean"
      }],
      "suggestedTopics": ["array"]
    }
  }
}
```

### Content Delivery
- CDN for video content
- Offline download capability
- Adaptive streaming
- Closed captions
- Multi-language support

## User Actions

### Primary Actions
1. **Continue Learning Path**
   - Resume current module
   - Track progress automatically
   - Complete lessons sequentially

2. **Browse Content**
   - Filter by category/type
   - Search functionality
   - Save for later
   - Start any content

3. **Interact with AI Coach**
   - Type questions
   - Voice input option
   - Rate responses
   - Save helpful answers

### Secondary Actions
1. **Manage Progress**
   - Mark complete manually
   - Review completed content
   - Retake quizzes
   - Reset progress

2. **Personalization**
   - Save favorites
   - Create playlists
   - Set learning reminders
   - Choose interests

3. **Social Features**
   - Share achievements
   - Recommend content
   - Discussion forums
   - Success stories

## Navigation Flow

### Entry Points
- Bottom navigation
- Dashboard education card
- Push notifications
- Deep links from AI coach

### Content Flow
```
Education Hub → Category → Content List → Content Viewer
             → Learning Path → Module → Lesson → Quiz
             → AI Coach → Conversation → Related Content
             → Search Results → Content Viewer
```

## Business Rules

1. **Learning Path Logic**
   - Sequential unlock by week
   - Must complete 80% to unlock next
   - Can review any completed content
   - Bonus content for high scores

2. **AI Coach Limitations**
   - Medical advice disclaimer
   - Escalation to human support
   - Content-based responses only
   - Privacy protection

3. **Content Recommendations**
   - Based on progress and goals
   - Difficulty progression
   - Interest tracking
   - Engagement patterns

4. **Gamification**
   - Points for completion
   - Badges for milestones
   - Streaks for daily learning
   - Leaderboards (optional)

## Error Handling

1. **Content Loading**
   - Offline mode support
   - Progressive download
   - Quality adaptation
   - Retry mechanisms

2. **AI Coach Errors**
   - Fallback responses
   - "I don't understand" handling
   - Network error messages
   - Queue questions offline

## Educational Design

1. **Microlearning Principles**
   - 5-15 minute segments
   - One concept per lesson
   - Interactive elements
   - Immediate application

2. **Learning Retention**
   - Spaced repetition
   - Quizzes and checks
   - Practical exercises
   - Real-world examples

3. **Accessibility**
   - Closed captions
   - Text alternatives
   - Adjustable playback speed
   - High contrast mode

## Analytics & Tracking

### Events to Track
- Content engagement rates
- Completion rates by type
- AI coach usage patterns
- Search queries
- Time spent learning

### Learning Metrics
- Module completion rates
- Quiz scores
- Knowledge retention
- Behavior change correlation

## Platform-Specific Considerations

### iOS
- Picture-in-picture video
- AirPlay support
- Siri shortcuts
- iCloud sync

### Android
- Background playback
- Chromecast support
- Google Assistant
- Auto-backup

## Mockup References
- **Headspace**: Beautiful learning paths
- **Duolingo**: Gamified progression
- **Coursera**: Content organization
- **Noom**: Bite-sized lessons

## Success Metrics
- Weekly module completion rate
- Content engagement time
- AI coach satisfaction
- Knowledge quiz scores
- Behavior change indicators

## Technical Notes
- Implement video player with HLS
- Cache content for offline viewing
- Natural language processing for AI
- Search indexing for content
- Analytics for personalization
- A/B testing for content formats