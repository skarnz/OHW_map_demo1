# OHW Health Journey - AI Asset Generation Guide

Complete guide for generating isometric health milestone sprites using AI.

## Overview

We use **Gemini 3 Pro** (aka "Nano Banana Pro") via OpenRouter to generate isometric game assets at ~$0.03-0.13 per image.

## Setup

### 1. Get OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Create account and add ~$5 credits (generates hundreds of assets)
3. Create API key
4. Add to `engine/.env.local`:
   ```
   OPENROUTER_API_KEY=sk-or-your-key-here
   ```

### 2. Available Models

| Model | Cost | Quality | Use Case |
|-------|------|---------|----------|
| `gemini-flash` | ~$0.03/img | Good | Rapid iteration |
| `gemini-pro` | ~$0.13/img | Best | Final assets |

## Workflow

### Step 1: Define Your Art Style

Before generating, establish visual direction:

1. **Color Palette** - Health/wellness colors (greens, blues, warm tones)
2. **Style** - Modern, clean, approachable
3. **Consistency** - All milestones should feel cohesive

### Step 2: Generate Reference Image (South View)

Start with the front-facing view:

```
Create an isometric [MILESTONE_NAME] building for a health journey game:

STYLE: Modern, clean wellness aesthetic
SIZE: [2x2/3x3/4x4] tile footprint (each tile is 44x22 pixels)
THEME: [Weight loss achievement / Fitness milestone / Nutrition goal / Wellness checkpoint]

CAMERA: 2:1 isometric projection, front-facing (south) view
- 30-degree angle from horizontal
- Building faces the camera

REQUIREMENTS:
1. Transparent PNG background
2. Building centered, bottom-center anchor point
3. Clean edges suitable for game sprites
4. Top-left lighting
5. No ground shadows
6. Vibrant but not oversaturated colors
7. Health/wellness visual elements (plants, nature, clean lines)
```

### Step 3: Generate Other Directions (Image-to-Image)

Once you approve the south view, use it as reference for consistent rotations:

```
This is an isometric [MILESTONE_NAME] building. Rotate to show the [north/east/west] view.

CRITICAL REQUIREMENTS:
- This MUST be the EXACT SAME building, just rotated
- Keep IDENTICAL: colors, proportions, details, style
- Same [2x2/3x3] tile footprint
- Same lighting from top-left
- Isometric 2:1 projection
- Transparent background

Do NOT create a new design. Rotate the EXISTING building.
```

### Step 4: Post-Processing

The engine auto-processes images:
1. Remove white/near-white backgrounds
2. Scale to proper sprite size
3. Position at bottom-center of 512x512 canvas
4. Register in game

## Health Milestone Prompts

### Weight Loss Milestones

**5lb Lost:**
```
Create an isometric "5 Pounds Lost" milestone marker for a health journey game:
- Style: Modern wellness, celebratory
- Size: 2x2 tiles
- Elements: Small trophy or flag, "5" prominently displayed, healthy green colors
- Feel: Encouraging first achievement
```

**10lb Lost:**
```
Create an isometric "10 Pounds Lost" milestone building:
- Style: Modern wellness
- Size: 2x2 tiles  
- Elements: Larger trophy, medal imagery, gold accents
- Feel: Significant achievement, pride
```

**25lb Lost (Major Milestone):**
```
Create an isometric "25 Pounds Lost" landmark building:
- Style: Grand achievement monument
- Size: 3x3 tiles
- Elements: Tall monument, victory imagery, fireworks/celebration details
- Feel: Major life achievement
```

### Activity Milestones

**First Workout:**
```
Create an isometric "First Workout" milestone:
- Style: Energetic, motivating
- Size: 2x2 tiles
- Elements: Small gym or fitness studio, running track elements
- Feel: Beginning of fitness journey
```

**7-Day Streak:**
```
Create an isometric "7 Day Workout Streak" building:
- Style: Athletic, accomplished
- Size: 2x2 tiles
- Elements: Flame/streak imagery, number 7, athletic equipment
- Feel: Momentum building
```

**30-Day Streak:**
```
Create an isometric "30 Day Fitness Streak" landmark:
- Style: Athletic temple/gym
- Size: 3x3 tiles
- Elements: Grand fitness structure, olympic imagery
- Feel: Serious dedication achieved
```

### Nutrition Milestones

**First Healthy Meal Logged:**
```
Create an isometric "First Healthy Meal" milestone:
- Style: Fresh, natural
- Size: 2x2 tiles
- Elements: Small cafe/restaurant with healthy food imagery, vegetables
- Feel: Beginning of nutrition journey
```

**Week of Balanced Eating:**
```
Create an isometric "Balanced Eating Week" building:
- Style: Garden/farm aesthetic
- Size: 2x2 tiles
- Elements: Small garden, fresh produce, kitchen elements
- Feel: Establishing healthy habits
```

### Wellness Milestones

**Meditation Started:**
```
Create an isometric "Meditation Started" milestone:
- Style: Zen, peaceful
- Size: 2x2 tiles
- Elements: Small zen garden, meditation cushion, water feature
- Feel: Inner peace beginning
```

**Hydration Goal Met:**
```
Create an isometric "Hydration Champion" milestone:
- Style: Clean, refreshing
- Size: 2x2 tiles
- Elements: Water fountain, water droplet imagery, blue accents
- Feel: Healthy habits
```

## Journey Decorations

**Health Trees:**
```
Create an isometric healthy tree prop:
- Style: Vibrant, life-affirming
- Size: 1x1 footprint, 3x3 render
- Elements: Lush green tree, maybe fruit/flowers
- Transparent background
```

**Wellness Fountain:**
```
Create an isometric wellness fountain decoration:
- Style: Serene, spa-like
- Size: 2x2 tiles
- Elements: Bubbling water, clean stone, plants
```

**Progress Path Tiles:**
```
Create isometric path tiles for a health journey:
- Completed path: Bright, golden/green brick road
- Future path: Faded, gray cobblestone
- Current position: Glowing marker
```

## Character Sprites

**User Avatar:**
```
Create a pixel art sprite sheet of a healthy walking character:
- Style: Friendly, approachable, diverse representation
- Size: 32x48 pixels per frame
- Poses: Walk cycle (4 frames) for each direction (N/S/E/W)
- Colors: Athleisure wear, bright sneakers
```

## Tips for Best Results

1. **Be specific** - Describe exactly what you want
2. **Include size** - Always specify footprint
3. **Mention style** - "Wellness", "health", "achievement"
4. **Request transparency** - Essential for game sprites
5. **Iterate** - Generate multiple, pick best, regenerate
6. **Consistent palette** - Keep colors cohesive across assets

## Cost Estimation

For a complete health journey with:
- 12 major milestones (4 directions each): 48 images
- 8 minor milestones (1 direction): 8 images
- 4 decorations: 4 images
- Character sprite sheets: ~8 images

**Total: ~68 images × $0.03 = ~$2.04** (using Gemini Flash)

Or **~68 images × $0.13 = ~$8.84** (using Gemini Pro for best quality)

## Integration

Generated assets are:
1. Saved to `engine/public/Building/[category]/`
2. Registered in `engine/app/data/buildings.ts`
3. Immediately available in the game

See the in-game Asset Generator modal or use the API directly.
