# Before/After Photos Screen Specification

## Screen Overview
**Screen ID**: S19  
**Screen Name**: Before/After Photos  
**Type**: Main App - Progress Visualization  
**Purpose**: Capture, store, and compare progress photos with alignment tools, privacy controls, and motivational features to support visual documentation of the weight management journey.

## Visual Design

### Layout Structure
- Header with privacy toggle
- Photo comparison view
- Timeline slider
- Photo capture/upload controls
- Sharing and export options
- Achievement celebrations

### UI Components

1. **Header Section**
   - Screen title: "Progress Photos"
   - Privacy lock icon (Face ID/Touch ID)
   - Settings menu (three dots)
   - Add photo button (+)

2. **Privacy & Security Notice**
   - **First Time Banner**
     - "Your photos are private and secure"
     - "Only you can see these unless you share"
     - "Enable privacy lock" option
     - Dismiss after acknowledgment

3. **Comparison View Modes**
   - **View Toggle**
     - Side-by-side
     - Overlay/Onion skin
     - Slider comparison
     - Grid view (all photos)
   - **Photo Selection**
     - "Before" photo selector
     - "After" photo selector
     - Date labels
     - Quick presets: Start/Current, 1 Month/3 Months

4. **Photo Display Area**
   - **Alignment Tools**
     - Ghost overlay of previous photo
     - Grid lines (rule of thirds)
     - Center alignment guide
     - Zoom to match size
   - **Photo Information**
     - Date taken
     - Weight at time
     - Days between photos
     - Measurements (if available)
   - **Interactive Features**
     - Pinch to zoom
     - Swipe between photos
     - Tap to see full screen
     - Long press for options

5. **Timeline Controls**
   - **Visual Timeline**
     - Photo thumbnails on timeline
     - Weight graph overlay
     - Milestone markers
     - Current position indicator
   - **Date Navigation**
     - Month/year selector
     - Jump to specific date
     - First/last photo buttons
   - **Playback Feature**
     - "Play" time-lapse button
     - Speed control
     - Pause at milestones

6. **Photo Capture Interface**
   - **Camera Overlay**
     - Previous photo ghost (adjustable opacity)
     - Alignment guides
     - Pose reminder icons
     - Timer option (3, 10 seconds)
   - **Capture Aids**
     - "Match this pose" helper
     - Distance guide (feet markers)
     - Lighting indicator
     - Multiple angle prompts (front, side, back)
   - **Post-Capture**
     - Retake option
     - Adjust alignment
     - Add to comparison
     - Save to timeline

7. **Photo Management**
   - **Organization**
     - Albums by date/milestone
     - Favorite photos
     - Hidden photos section
     - Trash (30-day recovery)
   - **Batch Actions**
     - Select multiple
     - Create comparison sets
     - Export selected
     - Delete selected

8. **Sharing Features**
   - **Privacy Controls**
     - Blur face option
     - Add watermark
     - Remove metadata
     - Create anonymous version
   - **Share Options**
     - Create comparison image
     - Add achievement overlay
     - Include stats (optional)
     - Social media templates
   - **Community Sharing**
     - Share to OHW community
     - Inspire others toggle
     - Success story submission

9. **Gamification & Motivation**
   - **Photo Milestones**
     - First photo badge
     - 30-day consistency
     - 10 photos captured
     - Full angle set
   - **Comparison Achievements**
     - Visible progress badge
     - Transformation milestone
     - Inspire others award
   - **Motivational Messages**
     - "Great consistency!"
     - "Your progress is showing!"
     - "X days of documentation!"

## Data Requirements

### Photo Metadata
```json
{
  "progressPhoto": {
    "id": "string",
    "captureDate": "ISO 8601",
    "type": "front|side|back|other",
    "metadata": {
      "weight": "number",
      "measurements": {
        "waist": "number",
        "hips": "number",
        "chest": "number"
      },
      "deviceInfo": {
        "camera": "front|back",
        "resolution": "string",
        "orientation": "portrait|landscape"
      }
    },
    "privacy": {
      "faceBlurred": "boolean",
      "isPublic": "boolean",
      "sharedWith": ["user_ids"]
    },
    "alignmentData": {
      "previousPhotoId": "string",
      "alignmentScore": "number",
      "pose": "string"
    },
    "tags": ["milestone", "favorite", "shared"],
    "notes": "string"
  }
}
```

### Comparison Sets
```json
{
  "comparisonSet": {
    "id": "string",
    "name": "string",
    "photos": [{
      "photoId": "string",
      "order": "number",
      "label": "string"
    }],
    "createdDate": "ISO 8601",
    "stats": {
      "weightChange": "number",
      "timespan": "days",
      "measurementChanges": {}
    }
  }
}
```

## User Actions

### Primary Actions
1. **Take Progress Photo**
   - Open camera
   - Align with guide
   - Capture photo
   - Save to timeline

2. **Compare Photos**
   - Select two photos
   - Choose comparison mode
   - View differences
   - Save comparison

3. **View Timeline**
   - Scroll through photos
   - See progress animation
   - Jump to dates
   - Play time-lapse

### Secondary Actions
1. **Manage Privacy**
   - Enable photo lock
   - Blur faces
   - Hide photos
   - Control sharing

2. **Create Shareable Content**
   - Generate comparison
   - Add text/stats
   - Apply templates
   - Export image

3. **Organize Photos**
   - Create albums
   - Tag milestones
   - Delete unwanted
   - Backup photos

## Navigation Flow

### Entry Points
- Dashboard progress card
- Weight entry screen
- Weekly check-in prompt
- Achievement notification

### Exit Points
- Back to dashboard
- Share to social
- Export to photos
- View in full gallery

## Business Rules

1. **Photo Guidelines**
   - Consistent clothing recommended
   - Same location/background
   - Similar lighting conditions
   - Same time of day ideal

2. **Privacy by Default**
   - Photos private unless shared
   - No automatic uploads
   - Local storage option
   - Encrypted cloud backup

3. **Capture Frequency**
   - Recommended: Weekly or bi-weekly
   - Minimum: Monthly
   - Maximum: Daily
   - Reminder notifications optional

4. **Storage Management**
   - Compress after 30 days
   - Keep originals 1 year
   - Archive older photos
   - User controls retention

## Error Handling

1. **Camera Issues**
   - Permission denied handling
   - Camera unavailable
   - Storage full warning
   - Low light detection

2. **Photo Quality**
   - Blur detection
   - Poor alignment warning
   - Lighting issues
   - Resolution problems

3. **Sync Problems**
   - Local storage first
   - Queue for upload
   - Retry mechanisms
   - Conflict resolution

## CDC Compliance Features

1. **Documentation Standards**
   - Date/time stamps required
   - Link to weight entries
   - Progress tracking
   - Provider access (with consent)

2. **Outcome Visualization**
   - Visual progress evidence
   - Motivation tool
   - Behavior reinforcement
   - Success documentation

## Privacy & Security

1. **Access Control**
   - Biometric lock option
   - Separate photo PIN
   - Hidden album support
   - Guest mode hiding

2. **Data Protection**
   - Local encryption
   - Secure cloud storage
   - No third-party access
   - HIPAA compliance

3. **Sharing Controls**
   - Explicit consent required
   - Watermark options
   - Metadata stripping
   - Revokable shares

## Gamification Elements

1. **Photo Achievements**
   - First photo: "Journey Begins"
   - 10 photos: "Dedicated Documenter"
   - 30-day streak: "Consistent Capturer"
   - Visible progress: "Transformation Visible"

2. **Comparison Rewards**
   - Create first comparison: +25 points
   - Share success story: +50 points
   - Inspire another user: +100 points
   - Monthly photo: +20 points

3. **Community Features**
   - Inspiration wall (opt-in)
   - Success story highlights
   - Motivational reactions
   - Progress celebrations

## Analytics & Tracking

### Events to Track
- Photo capture frequency
- Comparison creation rate
- Sharing patterns
- Feature usage (alignment, etc.)
- Time spent viewing

### Health Correlation
- Photo frequency vs. success
- Sharing impact on motivation
- Visual progress milestones
- Engagement patterns

## Platform-Specific Considerations

### iOS
- iCloud photo backup
- Live Photo support
- Portrait mode integration
- Photos app extension

### Android
- Google Photos backup
- Camera2 API features
- ML Kit pose detection
- Gallery integration

## Mockup References
- **Progress**: Photo alignment and comparison
- **MyFitnessPal**: Progress photo timeline
- **Centr**: Before/after templates
- **Future**: Pose matching guides

## Success Metrics
- Photos per user per month
- Comparison creation rate
- Sharing/inspiration rate
- Feature adoption rates
- User satisfaction scores

## Technical Notes
- Implement pose detection AI
- Photo alignment algorithms
- Secure storage encryption
- Compression strategies
- Time-lapse generation
- Privacy-preserving sharing