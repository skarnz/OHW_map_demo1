# Add Food Screen Specification

## Screen Overview
**Screen ID**: S13  
**Screen Name**: Add Food Screen  
**Type**: Food Entry - Multi-method Input  
**Purpose**: Comprehensive interface for adding food items to the diary through various methods including search, barcode scan, favorites, and manual entry.

## Visual Design

### Layout Structure
- Header with back button and meal selector
- Search bar with filter options
- Tab navigation for entry methods
- Results/content area
- Selected items summary
- Add to diary button

### UI Components

1. **Header Section**
   - Back arrow
   - Title: "Add Food"
   - Meal selector dropdown (Breakfast/Lunch/Dinner/Snack)
   - Current date display

2. **Search Section**
   - Search input with icon
   - Voice search button
   - Filter chips:
     - All
     - Branded
     - Generic
     - My Foods
     - Recipes
   - "Scan Barcode" button

3. **Tab Navigation**
   - Search (default)
   - Recent
   - Favorites
   - My Foods
   - Create Food

4. **Search Results View**
   ```
   [Food Image] Food Name
                Brand Name
                100g | 150 cal
                [+] Add button
   ```
   - Infinite scroll
   - Loading states
   - No results message

5. **Recent Foods View**
   - Grouped by date
   - "Yesterday", "2 days ago", etc.
   - Quick add with previous portion
   - Edit portion before adding

6. **Favorites View**
   - Grid or list toggle
   - Alphabetical sorting
   - Quick add options
   - Manage favorites link

7. **My Foods View**
   - Custom created foods
   - Saved recipes
   - Edit/Delete options
   - Share with community option

8. **Create Food Form**
   - Food name input
   - Brand (optional)
   - Serving size inputs
   - Nutrition facts:
     - Calories
     - Protein (g)
     - Carbs (g)
     - Fat (g)
     - Fiber (g) - optional
     - Sugar (g) - optional
     - Sodium (mg) - optional
   - Save to My Foods checkbox
   - Barcode input (optional)

9. **Selected Items Summary** (Bottom sheet)
   - List of selected items
   - Quantity adjusters
   - Total calories
   - "Add [X] items" button

## Data Requirements

### Input Data
- Search query
- Selected meal type
- Barcode data
- Manual nutrition info
- Serving quantities
- User preferences

### Display Data
```json
{
  "searchResults": [{
    "id": "food_abc123",
    "name": "Greek Yogurt",
    "brand": "Chobani",
    "verified": true,
    "imageUrl": "https://storage/foods/yogurt.jpg",
    "servings": [{
      "amount": 1,
      "unit": "container",
      "weight": 150,
      "nutrition": {
        "calories": 140,
        "protein": 12,
        "carbs": 20,
        "fat": 2,
        "fiber": 0,
        "sugar": 18,
        "sodium": 65
      }
    }],
    "alternativeServings": [
      {"amount": 100, "unit": "g"},
      {"amount": 1, "unit": "cup"}
    ]
  }],
  "recentFoods": [{
    "id": "recent_123",
    "foodId": "food_abc123",
    "name": "Greek Yogurt",
    "brand": "Chobani",
    "lastLogged": "2025-07-01T08:00:00Z",
    "meal": "breakfast",
    "quantity": 1,
    "unit": "container",
    "calories": 140
  }],
  "favorites": [...],
  "myFoods": [...]
}
```

### Food Database Schema
```json
{
  "food": {
    "id": "string",
    "name": "string",
    "brand": "string|null",
    "barcode": "string|null",
    "verified": "boolean",
    "source": "usda|user|branded",
    "servings": [{
      "default": "boolean",
      "amount": "number",
      "unit": "string",
      "weight_g": "number",
      "nutrition": {
        "calories": "number",
        "protein": "number",
        "carbs": "number",
        "fat": "number",
        "fiber": "number|null",
        "sugar": "number|null",
        "sodium": "number|null",
        "saturated_fat": "number|null",
        "cholesterol": "number|null"
      }
    }],
    "createdBy": "userId|null",
    "createdAt": "datetime",
    "popularity": "number"
  }
}
```

## User Actions

### Primary Actions
1. **Search for Food**
   - Type in search bar
   - View results
   - Tap to view details
   - Select serving size
   - Add to diary

2. **Scan Barcode**
   - Tap scan button
   - Point at barcode
   - Auto-detect and search
   - Confirm food match
   - Add to diary

3. **Quick Add Recent**
   - View recent foods
   - Tap quick add
   - Adjust quantity if needed
   - Confirm addition

4. **Create Custom Food**
   - Fill nutrition form
   - Save to database
   - Add to current meal
   - Share publicly (optional)

### Secondary Actions
1. **Manage Favorites**
   - Add/remove favorites
   - Organize in folders
   - Set quick portions

2. **Edit Serving Size**
   - Tap serving dropdown
   - Select unit
   - Adjust quantity
   - See real-time nutrition update

3. **View Food Details**
   - Tap info icon
   - See full nutrition
   - View ingredients (if available)
   - Report incorrect data

4. **Multi-add Mode**
   - Select multiple items
   - Adjust quantities
   - Add all at once

## Navigation Flow

### Entry Points
- Food Tracking screen FAB
- Meal section "Add" buttons
- Quick action from dashboard
- Barcode scan shortcut
- Voice command

### Exit Points
- Back to Food Tracking (with items)
- Cancel (with confirmation if items selected)
- Food details screen
- Barcode scanner
- Create recipe flow

### Navigation Map
```
Add Food → Search Results → Food Details
        → Barcode Scanner → Confirm Food
        → Recent Foods → Quick Add
        → Create Food → Save
        → Multi-select → Batch Add
```

## Integration Points

### API Endpoints
- GET /api/foods/search?q={query}
- GET /api/foods/barcode/{code}
- GET /api/foods/recent
- GET /api/foods/favorites
- POST /api/foods/custom
- POST /api/tracking/food/batch

### Data Sources
- USDA Food Database
- Branded foods database
- User-generated foods
- Barcode database
- Nutrition APIs

### Third-party Integrations
- Barcode scanning SDK
- Voice recognition
- Image recognition (future)
- Nutrition databases
- Recipe import services

## Business Rules

1. **Search Algorithm**
   - Prioritize exact matches
   - Consider user history
   - Boost verified items
   - Filter by dietary preferences
   - Fuzzy matching for typos

2. **Serving Sizes**
   - Show common units first
   - Convert between units
   - Default to last used
   - Allow decimal inputs
   - Validate reasonable amounts

3. **Custom Foods**
   - Require minimum: calories, name
   - Auto-calculate calories from macros
   - Flag unusual nutrition values
   - Moderate public submissions
   - Version control for edits

4. **Duplicate Prevention**
   - Check for existing barcodes
   - Suggest similar foods
   - Merge duplicate entries
   - Prefer verified sources

## Error Handling

1. **Search Errors**
   - "No results found" message
   - Suggest alternatives
   - Create food option
   - Try different terms hint

2. **Barcode Not Found**
   - Manual search option
   - Create new food
   - Report missing barcode
   - Try again button

3. **Network Issues**
   - Offline food cache
   - Queue for later sync
   - Show cached results
   - Retry failed requests

## Performance Optimization

1. **Search Performance**
   - Debounce input (300ms)
   - Cache popular searches
   - Elasticsearch implementation
   - Progressive result loading
   - Optimize image loading

2. **Data Efficiency**
   - Paginated results (20 items)
   - Lazy load images
   - Compress food database
   - CDN for static content
   - Efficient API responses

## Analytics & Tracking

### Events to Track
- Search queries
- Entry method used
- Time to add food
- Barcode scan success rate
- Custom food creation
- Serving size changes

### Key Metrics
- Most searched foods
- Scan vs manual entry ratio
- Average items per meal
- Custom food usage
- Search success rate

## Platform-Specific Considerations

### iOS
- Haptic feedback on selection
- 3D touch preview
- Spotlight search integration
- Siri shortcuts

### Android
- Material Design 3
- Quick tile for scanner
- Google Assistant actions
- Instant Apps for sharing

## Accessibility Features
- Screen reader optimized
- Voice search support
- Large touch targets
- Color contrast compliance
- Keyboard navigation
- Alternative text for images

## Success Metrics
- <10 seconds to add food
- 95% search success rate
- 80% barcode recognition
- 70% use quick methods
- <3 taps average to add

## Technical Notes
- Implement typeahead search
- Use virtual scrolling for long lists
- Cache frequently accessed foods
- Implement undo functionality
- Support batch operations
- Optimize for low bandwidth