# Food Camera Screen Specification

## Screen Overview
**Screen ID**: S14  
**Screen Name**: Food Camera Screen  
**Type**: AI-Powered Food Recognition  
**Purpose**: Enable quick food logging through photo capture with AI-powered food recognition, portion estimation, and manual adjustment capabilities.

## Visual Design

### Layout Structure
- Camera viewfinder (full screen)
- Camera controls overlay
- Captured photo review
- AI analysis results
- Manual adjustment interface
- Confirmation screen

### UI Components

1. **Camera Capture Mode**
   - Full-screen viewfinder
   - Semi-transparent overlay guides:
     - Circle guide for plate view
     - Grid lines for alignment
     - "Center your plate" hint
   - Bottom controls bar:
     - Gallery icon (left)
     - Capture button (center)
     - Flash toggle (right)
   - Top bar:
     - Close (X) button
     - Tips icon (?)
     - Meal selector chip

2. **Photo Review Mode**
   - Captured/selected photo display
   - Bottom actions:
     - Retake button
     - Use Photo button
   - Processing indicator overlay

3. **AI Analysis Results**
   - Photo with bounding boxes
   - Detected items list:
     ```
     ✓ Grilled Chicken Breast
       ~6 oz | 165 cal
       
     ✓ Brown Rice
       ~1 cup | 216 cal
       
     ✓ Steamed Broccoli
       ~1.5 cups | 55 cal
     ```
   - Confidence indicators
   - "Add item" button
   - Total calories summary

4. **Item Detail/Edit Card**
   - Food name (editable)
   - Portion size adjuster:
     - Visual size selector
     - Numeric input
     - Unit dropdown
   - Calorie update (real-time)
   - Nutrition preview
   - Confirm/Remove buttons

5. **Manual Addition Interface**
   - Search bar overlay
   - Quick suggestions based on image
   - Recent foods in category
   - "Can't find?" → Create custom

6. **Confirmation Screen**
   - Final photo thumbnail
   - Complete items list
   - Total nutrition summary:
     - Calories: 436
     - Protein: 35g
     - Carbs: 52g
     - Fat: 8g
   - Meal assignment
   - Notes field (optional)
   - "Add to Diary" button

## Data Requirements

### Input Data
- Camera feed/photo
- Selected meal type
- User's typical portions
- Historical food patterns
- Custom portion preferences

### AI Analysis Response
```json
{
  "photoAnalysis": {
    "id": "analysis_123",
    "photoUrl": "https://storage/photos/meal_123.jpg",
    "processedAt": "2025-07-02T12:30:00Z",
    "mealType": "lunch",
    "detectedItems": [{
      "id": "detect_1",
      "foodId": "food_chicken_001",
      "name": "Grilled Chicken Breast",
      "confidence": 0.92,
      "boundingBox": {
        "x": 120, "y": 80,
        "width": 200, "height": 150
      },
      "estimatedPortion": {
        "amount": 6,
        "unit": "oz",
        "confidence": 0.85
      },
      "nutrition": {
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6
      },
      "alternativeMatches": [
        {"name": "Baked Chicken", "confidence": 0.78},
        {"name": "Turkey Breast", "confidence": 0.65}
      ]
    }],
    "unrecognizedAreas": [{
      "boundingBox": {...},
      "suggestedCategory": "sauce"
    }],
    "totalNutrition": {
      "calories": 436,
      "protein": 35,
      "carbs": 52,
      "fat": 8
    },
    "plateSize": "estimated_10_inch",
    "analysisQuality": "high"
  }
}
```

### Manual Adjustment Data
```json
{
  "adjustments": [{
    "detectionId": "detect_1",
    "action": "modify|remove|add",
    "updates": {
      "name": "Grilled Chicken Thigh",
      "portion": {
        "amount": 5,
        "unit": "oz"
      }
    }
  }],
  "addedItems": [{
    "foodId": "food_sauce_123",
    "name": "BBQ Sauce",
    "portion": {"amount": 2, "unit": "tbsp"},
    "calories": 30
  }],
  "notes": "Had seconds of rice"
}
```

## User Actions

### Primary Actions
1. **Capture Photo**
   - Tap capture button
   - Auto-focus on tap
   - Review captured image
   - Retake if needed

2. **Select from Gallery**
   - Tap gallery icon
   - Choose recent photo
   - Crop if needed
   - Proceed to analysis

3. **Adjust Detected Items**
   - Tap item to edit
   - Change portion size
   - Correct misidentified food
   - Remove incorrect items

4. **Add Missing Items**
   - Tap "Add item"
   - Search or browse
   - Set portion
   - Confirm addition

5. **Confirm and Log**
   - Review all items
   - Add notes
   - Assign to meal
   - Save to diary

### Secondary Actions
1. **View Tips**
   - Photography best practices
   - Portion estimation guides
   - AI accuracy tips

2. **Switch Detection**
   - Choose alternative matches
   - Report incorrect detection
   - Improve AI training

3. **Save as Recipe**
   - Name the combination
   - Save for quick logging
   - Share with community

4. **Comparison Mode**
   - View similar past meals
   - Copy previous portions
   - Track consistency

## Navigation Flow

### Entry Points
- Food Tracking screen FAB
- Quick action from dashboard
- Meal reminder notification
- Camera app share extension

### Exit Points
- Save to food diary
- Cancel (with confirmation)
- Switch to manual entry
- View nutrition details

### Navigation Map
```
Camera → Capture → AI Analysis → Adjust Items → Confirm
      ↓         ↓              ↓              ↓
   Gallery   Retake      Manual Search    Food Diary
```

## Integration Points

### API Endpoints
- POST /api/photos/upload
- POST /api/photos/analyze
- PUT /api/photos/{id}/adjustments
- GET /api/foods/suggestions?context=photo
- POST /api/tracking/food/photo

### AI/ML Services
- Food recognition model
- Portion estimation model
- Plate size detection
- Nutritional database matching
- Continuous learning pipeline

### Third-party Integrations
- Cloud Vision API (backup)
- Image optimization service
- CDN for photo storage
- ML model hosting service

## Business Rules

1. **Photo Requirements**
   - Max file size: 10MB
   - Supported formats: JPEG, PNG, HEIF
   - Auto-compress if needed
   - Require adequate lighting
   - Store for 90 days

2. **AI Confidence Thresholds**
   - High confidence: >85% (auto-confirm)
   - Medium: 60-85% (user verify)
   - Low: <60% (manual entry)
   - Always show alternatives
   - Learn from corrections

3. **Portion Estimation**
   - Use plate size reference
   - Consider user history
   - Default to common portions
   - Allow ±50% quick adjust
   - Show visual guides

4. **Privacy & Storage**
   - Photos encrypted at rest
   - User consent for AI training
   - Option to delete photos
   - No facial recognition
   - HIPAA compliant storage

## Error Handling

1. **Camera Issues**
   - Permission denied message
   - Camera unavailable fallback
   - Low light warning
   - Focus failure retry

2. **AI Analysis Failures**
   - Timeout after 10 seconds
   - Fallback to manual entry
   - "Try again" option
   - Report issue button

3. **Network Issues**
   - Queue for later analysis
   - Offline manual entry
   - Save photo locally
   - Sync when connected

## Performance Optimization

1. **Image Processing**
   - Client-side compression
   - Progressive upload
   - Thumbnail generation
   - Smart crop suggestions
   - WebP format support

2. **AI Performance**
   - Edge model for basic detection
   - Cloud model for complex meals
   - Result caching
   - Batch processing option
   - Progressive enhancement

## Analytics & Tracking

### Events to Track
- Photo capture method
- AI accuracy rates
- Manual corrections made
- Time to complete logging
- Feature adoption rate
- Portion adjustment patterns

### Key Metrics
- Photos analyzed daily
- AI acceptance rate
- Average confidence score
- Correction frequency
- Time saved vs manual

## Platform-Specific Considerations

### iOS
- Live Text integration
- ProRAW support
- Photographic Styles
- Camera shortcuts
- ML Core optimization

### Android
- CameraX implementation
- Night mode support
- ML Kit integration
- Gallery app integration
- Edge TPU support

## Accessibility Features
- Voice descriptions of detected foods
- Audio capture cues
- High contrast boundaries
- Text size adjustments
- Voice-guided positioning
- Alternative manual entry

## Success Metrics
- 80% AI accuracy rate
- <30 seconds total logging time
- 70% feature adoption
- 85% user satisfaction
- 50% reduction in logging friction

## Technical Notes
- Implement real-time preview
- Use WebRTC for camera
- Progressive JPEG loading
- Client-side ML inference
- Implement photo caching
- Support batch uploads