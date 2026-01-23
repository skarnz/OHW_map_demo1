# MyFitnessPal Integration Considerations

## How MyFitnessPal Works

### Basic Process
1. **Profile-based Calorie Target**: Based on fitness profile, recommends daily Net Calorie target for weight loss/gain goals
2. **Daily Logging**: Users log meals and exercise throughout the day
3. **Calorie Calculation**: Calculates calories consumed from food and burned from exercise
4. **Progress Tracking**: Shows remaining calories for the day
5. **Weekly Check-ins**: Recommends weekly weigh-ins to track progress and adjust goals

### Key Formula
**Net Calories = Calories Consumed (Food) - Calories Burned (Exercise)**

## Initial Goal Calculation

### Base Calculation Factors
- Age
- Gender
- Height
- Weight
- Activity level
- Desired rate of weight loss

### Minimum Calorie Thresholds
- Women: Minimum 1200 calories per day
- Men: Minimum 1500 calories per day

### Dynamic Adjustments
- Daily calorie goals increase when exercise is logged
- Goals update as weight changes
- Exercise calories are distributed across macronutrients

## Key Features

### Food Logging
- **Extensive Food Database**: Pre-populated with millions of foods
- **Custom Food Creation**: Users can add foods not in database
- **Barcode Scanning**: Quick food entry
- **Recipe Builder**: Create custom recipes
- **Recent/Frequent Foods**: Quick access to commonly logged items

### Goal Customization
- **Macronutrient Goals**: Set custom ratios for carbs, protein, fat
- **Micronutrient Tracking**: Track additional vitamins and minerals
- **Premium Features**:
  - Set precise goals in gram increments
  - Custom goals by day of the week
  - Control over exercise calorie distribution

### Exercise Tracking
- **Cardiovascular Exercise**: Calculates calorie burn
- **Strength Training**: Tracked but calories not automatically calculated
- **Workout Routines**: New feature allowing multi-exercise routines with calorie burn
- **Step Tracking Integration**: Multiple options including:
  - Built-in phone motion detection
  - Third-party fitness tracker integration
  - Automatic calorie adjustments based on activity level

### Progress Monitoring
- **Weight Tracking**: Daily recording capability
- **Measurements**: Track body measurements (waist, hips, etc.)
- **Progress Photos**: Visual history of achievements
- **Starting Weight Management**: Ability to reset starting point for new phases

## Special Features

### Intermittent Fasting Tracker (Premium)
- **Supported Patterns**:
  - 12:12 (12-hour fast, 12-hour eating)
  - 14:10 (14-hour fast, 10-hour eating)
  - 16:8 (16-hour fast, 8-hour eating)
- **Features**:
  - Manual start/stop flexibility
  - Edit active and previous fasts
  - Visual progress tracking
  - Fasting history

### Weekly Habits (SMART Goals)
- **Available Habits**:
  - Eat more protein
  - Drink more water
  - Eat more fruits/vegetables
  - Log more meals
  - Eat more fiber
  - Get more exercise
  - Drink less alcohol
  - Reduce added sugar
- **Weekly Reset**: New habits can be set each week

### Workout Routines
- **Multi-exercise Routine Creation**: Build custom workout plans
- **Strength Exercise Calorie Calculation**: Unlike standalone strength tracking
- **Exercise Library**: Pre-made routines available
- **Set/Rep/Weight Tracking**: Detailed workout logging

## Integration Considerations for OHW

### Data Points Available
- Calorie intake/burn
- Macronutrient breakdown
- Weight history
- Exercise logs
- Step counts
- Water intake
- Custom measurements

### API Integration Benefits
- Leverage existing food database
- Sync exercise data
- Import historical weight data
- Utilize barcode scanning functionality

### User Experience Advantages
- Familiar interface for existing MFP users
- Reduced data entry burden
- Comprehensive tracking in one ecosystem
- Social features and community support

### Premium Features Worth Considering
- Custom macro goals
- Intermittent fasting tracking
- Advanced progress analytics
- Priority customer support

## Technical Considerations

### Platform Support
- iOS app
- Android app
- Web interface
- API access for third-party integrations

### Data Sync
- Real-time syncing across devices
- Integration with 50+ fitness apps and devices
- Export capabilities for data portability

### Privacy & Security
- User-controlled data sharing
- HIPAA considerations for medical integration
- Account security features