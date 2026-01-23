# Food Tracking Screen Specification

## Screen Overview
**Screen ID**: S12  
**Screen Name**: Food Tracking  
**Type**: Main App - Primary Tracking Feature  
**Purpose**: Central hub for viewing, managing, and analyzing food intake. Displays daily food diary, nutritional summaries, and provides quick access to add meals.

## Visual Design

### Layout Structure
- Header with date navigation
- Daily nutrition summary
- Meal sections (Breakfast, Lunch, Dinner, Snacks)
- Floating action button for adding food
- Bottom navigation bar

### UI Components

1. **Header Section**
   - Title: "Food Diary"
   - Date selector with arrows (< Today >)
   - Calendar icon for date picker
   - Settings gear icon (meal preferences)

2. **Daily Nutrition Summary**
   - Circular progress ring for calories
     - [X] / [Goal] calories
     - Center: % of goal
   - Macro breakdown bars
     - Protein: [X]g / [Goal]g
     - Carbs: [X]g / [Goal]g
     - Fat: [X]g / [Goal]g
   - Water intake tracker
     - [X] / 8 glasses icon row

3. **Meal Sections** (Expandable/Collapsible)
   
   **A. Breakfast** ([X] calories)
   - Time logged: 8:15 AM
   - Food items list:
     - Item name | Quantity | Calories
     - Quick edit/delete swipe actions
   - "Add Food" button if empty
   - Photo thumbnail if available

   **B. Lunch** ([X] calories)
   - Similar structure to breakfast

   **C. Dinner** ([X] calories)
   - Similar structure to breakfast

   **D. Snacks** ([X] calories)
   - All snacks grouped together
   - Time stamps for each

4. **Empty State (per meal)**
   - Icon representing meal
   - "Log your [meal]" message
   - "Add Food" button

5. **Floating Action Button**
   - Plus icon
   - Quick add menu on tap:
     - Search food
     - Scan barcode
     - Take photo
     - Recent foods
     - Create recipe

6. **Bottom Section**
   - "View Nutrition Details" link
   - "Copy from Previous Day" option

## Data Requirements

### Input Data
- Selected date
- User's calorie/macro goals
- Food database access
- User's recent foods
- Saved recipes
- Photo storage

### Display Data
```json
{
  "foodDiary": {
    "date": "2025-07-02",
    "goals": {
      "calories": 2000,
      "protein": 100,
      "carbs": 200,
      "fat": 67,
      "water": 8
    },
    "summary": {
      "totalCalories": 1450,
      "totalProtein": 82,
      "totalCarbs": 165,
      "totalFat": 48,
      "waterGlasses": 6
    },
    "meals": {
      "breakfast": {
        "calories": 380,
        "loggedAt": "2025-07-02T08:15:00Z",
        "items": [{
          "id": "food_123",
          "name": "Oatmeal with berries",
          "brand": "Quaker",
          "quantity": 1,
          "unit": "cup",
          "calories": 300,
          "protein": 10,
          "carbs": 54,
          "fat": 6
        }],
        "photoUrl": "https://storage/food/photo_123.jpg"
      },
      "lunch": {...},
      "dinner": {...},
      "snacks": [...]
    }
  }
}
```

### Real-time Updates
- Calorie/macro totals
- Water intake progress
- Sync across devices
- Recent foods list

## User Actions

### Primary Actions
1. **Add Food Entry**
   - Tap FAB or meal "Add" button
   - Choose entry method
   - Navigate to appropriate screen

2. **Edit Food Entry**
   - Tap on food item
   - Edit quantity/details
   - Save changes

3. **Delete Food Entry**
   - Swipe left on item
   - Confirm deletion
   - Update totals

4. **Navigate Dates**
   - Swipe or tap arrows
   - Select from calendar
   - Load historical data

### Secondary Actions
1. **View Nutrition Details**
   - Tap summary or link
   - See full breakdown
   - View trends

2. **Take/View Photo**
   - Tap camera icon
   - Capture meal photo
   - View existing photos

3. **Copy Previous Day**
   - Select meals to copy
   - Adjust as needed
   - Quick logging

4. **Share Progress**
   - Export daily summary
   - Share with provider
   - Generate reports

## Navigation Flow

### Entry Points
- Dashboard quick action
- Bottom navigation "Track"
- Notification reminders
- Widget shortcuts

### Exit Points
- Add Food Screen
- Food Camera Screen
- Nutrition Details
- Settings/Preferences
- Other bottom nav sections

### Navigation Map
```
Food Tracking → Add Food Screen
             → Food Camera
             → Barcode Scanner
             → Search Foods
             → Recent Foods
             → Create Recipe
             → Nutrition Details
             → Meal Settings
```

## Integration Points

### API Endpoints
- GET /api/tracking/food?date={date}
- POST /api/tracking/food
- PUT /api/tracking/food/{id}
- DELETE /api/tracking/food/{id}
- GET /api/tracking/food/recent
- GET /api/nutrition/goals

### Data Sources
- Food database service
- User preferences service
- Photo storage service
- Nutrition calculation service
- Recipe service

### Third-party Integrations
- Barcode scanning library
- Food database APIs (USDA, etc.)
- Image recognition service
- MyFitnessPal sync (if enabled)

## Business Rules

1. **Meal Timing**
   - Auto-assign meals based on time:
     - Breakfast: 4 AM - 11 AM
     - Lunch: 11 AM - 4 PM
     - Dinner: 4 PM - 9 PM
     - Snacks: Any time
   - Allow manual meal assignment

2. **Calorie Calculations**
   - Real-time total updates
   - Include exercise calories if enabled
   - Show net calories option
   - Highlight when over goal

3. **Data Validation**
   - Reasonable calorie ranges (0-5000)
   - Valid macro proportions
   - Prevent duplicate entries
   - Confirm large portions

4. **Historical Access**
   - View up to 1 year back
   - Edit within 7 days
   - Lock older entries (provider can unlock)
   - Export capabilities

## Error Handling

1. **Offline Mode**
   - Cache recent foods locally
   - Queue entries for sync
   - Show offline indicator
   - Sync when connected

2. **Data Conflicts**
   - Server timestamp priority
   - Show conflict resolution
   - Merge when possible
   - User choice for conflicts

3. **Invalid Entries**
   - Validation messages
   - Suggest corrections
   - Prevent submission
   - Help text available

## Performance Optimization

1. **Data Loading**
   - Lazy load meal sections
   - Cache current week
   - Prefetch adjacent days
   - Optimize image loading

2. **Search Performance**
   - Local recent foods cache
   - Debounced search input
   - Predictive loading
   - Indexed food database

## Analytics & Tracking

### Events to Track
- Meal logging frequency
- Entry methods used
- Time to log meals
- Photo usage rate
- Barcode scan success
- Copy meal usage

### Key Metrics
- Daily logging rate
- Complete diary days
- Average time to log
- Most used entry method
- Meal skip patterns

## Platform-Specific Considerations

### iOS
- Shortcuts app integration
- HealthKit sync option
- Widget for quick add
- Focus mode support

### Android
- Google Fit integration
- Quick settings tile
- Android shortcuts
- Wear OS companion

## Accessibility Features
- VoiceOver/TalkBack support
- Voice input for food names
- Large tap targets (44pt/48dp)
- High contrast mode
- Screen reader descriptions

## Success Metrics
- 90% daily logging compliance
- <2 minutes average logging time
- 80% user satisfaction rating
- 50% photo usage rate
- 70% consistent logging streak

## Technical Notes
- Implement optimistic UI updates
- Support batch operations
- Enable offline functionality
- Use CDN for food images
- Implement smart caching
- Support undo/redo actions