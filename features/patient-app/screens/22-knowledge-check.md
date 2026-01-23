# Knowledge Check Screen Specification

## Screen Overview
**Screen ID**: S22  
**Screen Name**: Knowledge Check  
**Type**: Education - Assessment  
**Purpose**: Interactive quiz interface to assess understanding of educational content, reinforce key concepts, and provide immediate feedback on learning progress.

## Visual Design

### Layout Structure
- Progress header with quiz title
- Question display area
- Answer options section
- Feedback/explanation zone
- Navigation controls
- Score tracker

### UI Components

1. **Header Section**
   - Quiz title and module reference
   - Question counter (e.g., "Question 3 of 10")
   - Progress bar
   - Timer (if applicable)
   - Exit confirmation

2. **Question Display**
   
   **A. Question Types**
   - Multiple choice (single answer)
   - Multiple select (multiple answers)
   - True/False
   - Fill in the blank
   - Matching pairs
   - Image-based questions
   
   **B. Question Elements**
   - Clear question text
   - Supporting images/diagrams
   - Hint button (if available)
   - Flag for review option
   - Difficulty indicator

3. **Answer Section**
   - Radio buttons for single choice
   - Checkboxes for multiple select
   - Drag-and-drop for matching
   - Text input for fill-in-blank
   - Visual feedback on selection
   - Submit/Next button

4. **Feedback Display**
   - Correct/Incorrect indicator
   - Explanation text
   - Reference to module content
   - Additional resources
   - Continue button

5. **Results Summary**
   - Final score display
   - Performance breakdown
   - Correct/incorrect review
   - Retake option
   - Certificate (if applicable)
   - Share achievement

## Data Requirements

### Input Data
- Quiz configuration
- Question bank
- User responses
- Time tracking
- Previous attempts

### Display Data
```json
{
  "knowledgeCheck": {
    "id": "string",
    "title": "string",
    "moduleId": "string",
    "config": {
      "totalQuestions": "number",
      "passingScore": "percentage",
      "timeLimit": "minutes",
      "allowRetake": "boolean",
      "randomizeQuestions": "boolean",
      "showFeedback": "immediate|end|none"
    },
    "questions": [{
      "id": "string",
      "type": "multiple-choice|multiple-select|true-false|fill-blank|matching",
      "text": "string",
      "media": {
        "type": "image|video",
        "url": "string"
      },
      "options": [{
        "id": "string",
        "text": "string",
        "image": "url"
      }],
      "correctAnswer": ["answerId"],
      "explanation": "string",
      "hint": "string",
      "points": "number",
      "difficulty": "easy|medium|hard"
    }],
    "userProgress": {
      "currentQuestion": "number",
      "answers": [{
        "questionId": "string",
        "selectedAnswer": ["answerId"],
        "isCorrect": "boolean",
        "timeSpent": "seconds"
      }],
      "score": "number",
      "startTime": "datetime",
      "endTime": "datetime",
      "attempts": "number"
    },
    "results": {
      "score": "percentage",
      "passed": "boolean",
      "correctAnswers": "number",
      "timeSpent": "minutes",
      "categoryBreakdown": [{
        "category": "string",
        "score": "percentage"
      }],
      "certificate": {
        "earned": "boolean",
        "url": "string"
      }
    }
  }
}
```

### Real-time Updates
- Answer submission
- Progress saving
- Score calculation
- Achievement unlocking

## User Actions

### Primary Actions
1. **Answer Questions**
   - Select answer options
   - Submit responses
   - Navigate questions
   - Use hints

2. **Review Feedback**
   - Read explanations
   - Access resources
   - Continue to next
   - Review flagged

3. **Complete Quiz**
   - Submit final answers
   - View results
   - Retake if allowed
   - Share achievement

### Secondary Actions
1. **Navigation**
   - Skip question
   - Previous question
   - Jump to question
   - Exit quiz

2. **Help Features**
   - Use hint
   - Flag for review
   - Report issue
   - Access help

## Navigation Flow

### Entry Points
- Module completion
- Education Hub
- Retake from results
- Notification reminder

### Exit Points
- Back to module
- Education Hub
- Next module
- Share results

### Navigation Map
```
Module Viewer → Knowledge Check → Results → Education Hub
                              → Review → Share
                              → Retake → Certificate
```

## Business Rules

1. **Quiz Configuration**
   - Minimum questions: 5
   - Maximum questions: 20
   - Passing score: 70-80%
   - Retry limit: 3 attempts

2. **Question Logic**
   - Random order option
   - Adaptive difficulty
   - Required questions
   - Time per question

3. **Scoring Rules**
   - Points per question
   - Partial credit
   - Negative marking
   - Bonus points

4. **Completion Rules**
   - All questions answered
   - Minimum time spent
   - Score threshold
   - Certificate criteria

## Error Handling

1. **Submission Errors**
   - Auto-save progress
   - Retry submission
   - Offline queue
   - Conflict resolution

2. **Navigation Issues**
   - Prevent data loss
   - Confirm exit
   - Resume capability
   - Progress recovery

## Performance Optimization

1. **Question Loading**
   - Preload next question
   - Cache question bank
   - Optimize media
   - Progressive loading

2. **Response Handling**
   - Instant feedback
   - Background sync
   - Offline capability
   - Batch submissions

## Analytics & Tracking

### Events to Track
- Quiz start/complete
- Question response time
- Hint usage
- Score distribution
- Retry patterns
- Drop-off points

### Key Metrics
- Average score
- Pass rate
- Time to complete
- Question difficulty
- Hint effectiveness
- Retry frequency

## Platform-Specific Considerations

### iOS
- Haptic feedback
- Keyboard shortcuts
- Split-screen support
- Handoff capability

### Android
- Material animations
- Back button handling
- Multi-window support
- Keyboard navigation

## Accessibility Requirements
- Screen reader support
- Keyboard navigation
- Color contrast compliance
- Text alternatives
- Time limit extensions
- Clear instructions

## Success Metrics
- Completion rate
- Average score improvement
- Knowledge retention
- User satisfaction
- Time to mastery