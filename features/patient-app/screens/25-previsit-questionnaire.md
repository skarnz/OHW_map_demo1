# Pre-visit Questionnaire Screen Specification

## Screen Overview
**Screen ID**: S25  
**Screen Name**: Pre-visit Questionnaire  
**Type**: Clinical - Data Collection  
**Purpose**: Gather comprehensive patient information before provider appointments to optimize visit time, ensure thorough assessment, and identify priority discussion topics.

## Visual Design

### Layout Structure
- Appointment header with details
- Progress indicator
- Sectioned questionnaire
- Review summary
- Submit confirmation
- Visit preparation tips

### UI Components

1. **Header Section**
   - Appointment date/time
   - Provider name
   - Visit type (in-person/telehealth)
   - Time until appointment
   - Completion deadline
   - Progress saved indicator

2. **Questionnaire Sections**
   
   **A. Current Status**
   - Weight and measurements
   - Vital signs (if available)
   - Overall health rating
   - Energy levels
   - Sleep quality
   
   **B. Medication Review**
   - Current medications list
   - Adherence assessment
   - Side effects experienced
   - Effectiveness rating
   - Refill needs
   
   **C. Progress & Challenges**
   - Goal achievement status
   - Biggest successes
   - Main challenges
   - Barriers encountered
   - Support needs
   
   **D. Symptoms & Concerns**
   - New symptoms checklist
   - Severity ratings
   - Duration tracking
   - Impact on daily life
   - Specific concerns
   
   **E. Lifestyle Factors**
   - Diet adherence
   - Exercise consistency
   - Stress levels
   - Social support
   - Work/life changes

3. **Priority Topics**
   - Top 3 discussion items
   - Rank by importance
   - Add custom topics
   - Time estimates
   - Supporting details

4. **Document Upload**
   - Lab results
   - Food diaries
   - Exercise logs
   - Photos/progress pics
   - Other documents

5. **Review Summary**
   - All responses overview
   - Edit capabilities
   - Missing items alert
   - Estimated read time
   - Submit button

6. **Confirmation Screen**
   - Submission timestamp
   - Provider notification
   - Visit preparation tips
   - What to bring
   - Next steps

## Data Requirements

### Input Data
- Patient responses
- Uploaded documents
- Priority rankings
- Symptom details
- Progress metrics

### Display Data
```json
{
  "preVisitQuestionnaire": {
    "appointment": {
      "id": "string",
      "date": "datetime",
      "provider": "string",
      "type": "in-person|telehealth",
      "duration": "minutes",
      "location": "string",
      "completionDeadline": "datetime"
    },
    "sections": {
      "currentStatus": {
        "weight": "number",
        "bloodPressure": "string",
        "heartRate": "number",
        "overallHealth": "1-10",
        "energyLevel": "1-10",
        "sleepHours": "number",
        "sleepQuality": "poor|fair|good|excellent"
      },
      "medications": {
        "current": [{
          "name": "string",
          "dose": "string",
          "frequency": "string",
          "adherence": "percentage",
          "sideEffects": ["effects"],
          "effectiveness": "1-5",
          "needsRefill": "boolean"
        }],
        "changes": "string",
        "concerns": "string"
      },
      "progress": {
        "goalsMet": "percentage",
        "weightChange": "number",
        "successes": ["achievements"],
        "challenges": [{
          "type": "string",
          "description": "string",
          "duration": "string",
          "needsHelp": "boolean"
        }],
        "barriers": ["barriers"]
      },
      "symptoms": {
        "new": [{
          "symptom": "string",
          "severity": "mild|moderate|severe",
          "frequency": "rare|occasional|frequent|constant",
          "startDate": "date",
          "impact": "string"
        }],
        "concerns": ["concerns"],
        "questions": ["questions"]
      },
      "lifestyle": {
        "dietAdherence": "percentage",
        "exerciseDays": "number",
        "stressLevel": "1-10",
        "socialSupport": "1-10",
        "majorChanges": "string"
      }
    },
    "priorities": [{
      "rank": "number",
      "topic": "string",
      "timeNeeded": "minutes",
      "details": "string"
    }],
    "attachments": [{
      "type": "lab|photo|log|other",
      "filename": "string",
      "uploadDate": "datetime",
      "size": "bytes"
    }],
    "submission": {
      "status": "draft|submitted",
      "lastSaved": "datetime",
      "submittedAt": "datetime",
      "readByProvider": "boolean"
    }
  }
}
```

### Real-time Updates
- Auto-save responses
- Upload progress
- Submission confirmation
- Provider notification

## User Actions

### Primary Actions
1. **Complete Sections**
   - Answer questions
   - Rate items
   - Add details
   - Upload files

2. **Set Priorities**
   - Select topics
   - Rank importance
   - Estimate time
   - Add context

3. **Submit Form**
   - Review answers
   - Make edits
   - Confirm submission
   - View confirmation

### Secondary Actions
1. **Navigation**
   - Save draft
   - Previous section
   - Jump to section
   - Exit form

2. **Help Features**
   - Question clarification
   - Example answers
   - Contact support
   - Skip options

## Navigation Flow

### Entry Points
- Appointment reminder
- Dashboard notification
- Provider request
- Calendar link

### Exit Points
- Dashboard return
- Appointment details
- Calendar app
- Help center

### Navigation Map
```
Notification → Pre-visit Form → Section 1-5 → Review → Submit
                             → Upload Docs → Priorities → Confirm
                             → Save Draft → Return Later
```

## Business Rules

1. **Timing Requirements**
   - Available 7 days before
   - Due 24 hours before
   - Reminder schedule
   - Late submission handling

2. **Completion Rules**
   - Required fields marked
   - Section dependencies
   - Minimum responses
   - Quality checks

3. **Data Validation**
   - Range checking
   - Consistency verification
   - Completeness scoring
   - Alert triggers

4. **Provider Integration**
   - Real-time submission
   - Priority flagging
   - Document attachment
   - Read receipts

## Error Handling

1. **Form Errors**
   - Field validation
   - Clear error messages
   - Inline corrections
   - Progress preservation

2. **Upload Issues**
   - Size limitations
   - Format restrictions
   - Retry mechanism
   - Alternative methods

## Performance Optimization

1. **Form Efficiency**
   - Section loading
   - Smart branching
   - Conditional questions
   - Progress caching

2. **Upload Optimization**
   - Compression options
   - Background uploads
   - Resume capability
   - Bandwidth management

## Analytics & Tracking

### Events to Track
- Form completion rate
- Section completion time
- Upload success rate
- Priority topics
- Submission timing
- Edit frequency

### Key Metrics
- Completion percentage
- Time to complete
- Topics prioritized
- Provider satisfaction
- Visit efficiency

## Platform-Specific Considerations

### iOS
- Files app integration
- iCloud document access
- Camera integration
- Calendar sync

### Android
- Google Drive access
- Document scanner
- Calendar integration
- File manager access

## Clinical Integration
- EHR data push
- Provider dashboard sync
- Appointment system link
- Alert generation
- Report formatting

## Success Metrics
- 90% completion rate
- <15 min completion time
- Provider time savings
- Visit satisfaction
- Health outcomes impact