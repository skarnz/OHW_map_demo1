# Favorite Meals Screen Specification

## Screen Overview
**Screen ID**: S28  
**Screen Name**: Favorite Meals  
**Type**: Food Tracking - Quick Access  
**Purpose**: Store and quickly access frequently eaten meals, recipes, and food combinations to streamline daily food logging and encourage consistent healthy eating patterns.

## Visual Design

### Layout Structure
- Search and filter bar
- Categorized meal grid/list
- Meal preview cards
- Quick add actions
- Management tools
- Import/create options

### UI Components

1. **Header Section**
   - "Favorite Meals" title
   - Search bar
   - Filter dropdown
   - View toggle (grid/list)
   - Add new meal button

2. **Filter & Sort Options**
   - Meal type (Breakfast/Lunch/Dinner/Snack)
   - Dietary tags
   - Calorie ranges
   - Recently used
   - Alphabetical
   - Custom categories

3. **Meal Cards Display**
   
   **A. Card Information**
   - Meal photo/icon
   - Custom meal name
   - Calorie count
   - Macro breakdown preview
   - Last used date
   - Quick add button
   - Favorite star
   
   **B. Expanded View**
   - Full ingredients list
   - Detailed nutrition
   - Portion sizes
   - Preparation notes
   - Tags/categories
   - Edit/Delete options

4. **Quick Actions**
   - One-tap log to today
   - Copy to create variant
   - Share with community
   - Schedule for future
   - Add to meal plan

5. **Meal Categories**
   - My Recipes
   - Restaurant Meals
   - Quick Snacks
   - Meal Prep
   - Family Favorites
   - Healthy Alternatives
   - Custom categories

6. **Creation Tools**
   - Add from recent logs
   - Build custom meal
   - Import from photo
   - Scan restaurant menu
   - Copy from community
   - Batch ingredient entry

## Data Requirements

### Input Data
- Meal components
- Custom names
- Photos
- Categories
- Nutritional overrides
- Portion adjustments

### Display Data
```json
{
  "favoriteMeals": {
    "meals": [{
      "id": "string",
      "name": "string",
      "category": "breakfast|lunch|dinner|snack|custom",
      "photo": "url",
      "isCustom": "boolean",
      "nutrition": {
        "calories": "number",
        "protein": "grams",
        "carbs": "grams",
        "fat": "grams",
        "fiber": "grams",
        "sugar": "grams",
        "sodium": "mg"
      },
      "ingredients": [{
        "foodId": "string",
        "name": "string",
        "amount": "number",
        "unit": "string",
        "calories": "number",
        "brand": "string"
      }],
      "portions": [{
        "name": "string",
        "multiplier": "number",
        "isDefault": "boolean"
      }],
      "metadata": {
        "createdDate": "date",
        "lastUsed": "date",
        "useCount": "number",
        "rating": "1-5",
        "tags": ["tags"],
        "notes": "string",
        "source": "manual|photo|community|restaurant"
      },
      "customization": {
        "allowSubstitutions": "boolean",
        "scalable": "boolean",
        "variants": ["mealIds"]
      }
    }],
    "categories": [{
      "id": "string",
      "name": "string",
      "icon": "string",
      "mealCount": "number",
      "isCustom": "boolean",
      "order": "number"
    }],
    "recentlyUsed": [{
      "mealId": "string",
      "usedDate": "datetime",
      "mealTime": "breakfast|lunch|dinner|snack"
    }],
    "suggestions": {
      "fromHistory": [{
        "foods": ["foodIds"],
        "frequency": "number",
        "suggestedName": "string",
        "nutrition": {}
      }],
      "seasonal": ["mealIds"],
      "trending": ["mealIds"]
    },
    "mealPlans": [{
      "id": "string",
      "name": "string",
      "meals": [{
        "day": "dayOfWeek",
        "mealTime": "string",
        "mealId": "string"
      }]
    }]
  }
}
```

### Real-time Updates
- Usage tracking
- Nutrition updates
- Photo uploads
- Sync across devices

## User Actions

### Primary Actions
1. **Quick Log Meal**
   - One-tap add to diary
   - Select meal time
   - Adjust portions
   - Confirm logging

2. **Manage Favorites**
   - Create new meal
   - Edit existing
   - Delete unused
   - Organize categories

3. **Search & Filter**
   - Find by name
   - Filter by criteria
   - Sort options
   - Recent items

### Secondary Actions
1. **Meal Creation**
   - Build from scratch
   - Import from log
   - Scan menu items
   - Community browse

2. **Sharing & Planning**
   - Share recipes
   - Create meal plan
   - Export lists
   - Print recipes

## Navigation Flow

### Entry Points
- Food tracking screen
- Quick add menu
- Dashboard shortcut
- Search results

### Exit Points
- Back to food log
- Meal details
- Create new meal
- Community sharing

### Navigation Map
```
Food Log → Favorite Meals → Quick Add → Diary
                        → Meal Details → Edit
                        → Create Meal → Save
                        → Categories → Organize
```

## Business Rules

1. **Meal Storage**
   - Max 200 favorites
   - Photo size limit: 5MB
   - Name length: 50 chars
   - Ingredient limit: 50

2. **Nutrition Accuracy**
   - Database validation
   - Manual override allowed
   - Portion scaling
   - Rounding rules

3. **Sharing Rules**
   - Privacy settings
   - Community guidelines
   - Attribution required
   - Modification allowed

4. **Organization**
   - Default categories
   - Custom limit: 20
   - Auto-categorization
   - Smart suggestions

## Error Handling

1. **Data Issues**
   - Missing nutrition info
   - Invalid portions
   - Sync conflicts
   - Database errors

2. **User Errors**
   - Duplicate names
   - Invalid inputs
   - Photo upload fails
   - Category limits

## Performance Optimization

1. **Load Efficiency**
   - Lazy loading
   - Image caching
   - Pagination
   - Search indexing

2. **Quick Actions**
   - Predictive loading
   - Offline access
   - Batch operations
   - Smart defaults

## Analytics & Tracking

### Events to Track
- Meal creation rate
- Usage frequency
- Category distribution
- Search patterns
- Sharing activity
- Time saved

### Key Metrics
- Active favorites count
- Reuse rate
- Creation sources
- Popular categories
- User satisfaction

## Platform-Specific Considerations

### iOS
- 3D Touch preview
- Drag and drop
- Siri shortcuts
- Widget access

### Android
- Long press actions
- App shortcuts
- Assistant integration
- Widget support

## Community Features
- Browse shared meals
- Rate recipes
- Comment system
- Modification tracking
- Attribution display
- Report inappropriate

## Success Metrics
- 50% faster logging
- Increased consistency
- Higher satisfaction
- Meal variety maintained
- Community engagement