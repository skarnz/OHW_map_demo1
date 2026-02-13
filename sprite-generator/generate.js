/**
 * Health Milestone Sprite Generator
 * Uses Gemini API via OpenRouter to generate isometric building sprites
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load API key from parent engine's .env.local
const envPath = path.join(__dirname, '../engine/.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKeyMatch = envContent.match(/OPENROUTER_API_KEY=(.+)/);
const OPENROUTER_API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!OPENROUTER_API_KEY) {
  console.error('Error: OPENROUTER_API_KEY not found in ../engine/.env.local');
  process.exit(1);
}

// Output directories
const OUTPUT_DIR = path.join(__dirname, 'output');
const SPRITES_DIR = path.join(OUTPUT_DIR, 'sprites');

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
if (!fs.existsSync(SPRITES_DIR)) fs.mkdirSync(SPRITES_DIR);

// Health milestone definitions
const MILESTONES = [
  {
    id: 'journey-start',
    name: 'Journey Begins',
    size: '2x2',
    prompt: `Create an isometric "Journey Begins" starting point building for a health journey game:
- Style: Modern wellness, welcoming, hopeful
- Size: 2x2 tile footprint (88x44 pixels base)
- Elements: An arch or gateway with "START" theme, sunrise colors, path leading in
- Colors: Warm sunrise oranges/yellows transitioning to healthy greens
- Feel: The beginning of an exciting wellness adventure
- Camera: 2:1 isometric, front-facing (south) view
- Background: Transparent/white
- No ground shadows`
  },
  {
    id: '5lb-milestone',
    name: '5 Pounds Lost',
    size: '2x2',
    prompt: `Create an isometric "5 Pounds Lost" milestone building for a health journey game:
- Style: Modern wellness, celebratory but modest
- Size: 2x2 tile footprint (88x44 pixels base)
- Elements: Small trophy pedestal or monument with "5" displayed, healthy plants
- Colors: Fresh greens and light blues, hint of gold
- Feel: First encouraging achievement
- Camera: 2:1 isometric, front-facing (south) view
- Background: Transparent/white
- No ground shadows`
  },
  {
    id: '10lb-milestone',
    name: '10 Pounds Lost',
    size: '2x2',
    prompt: `Create an isometric "10 Pounds Lost" milestone building for a health journey game:
- Style: Modern wellness, celebratory
- Size: 2x2 tile footprint (88x44 pixels base)
- Elements: Small pavilion or shrine with "10" displayed, victory wreath or laurels
- Colors: Vibrant greens, teals, gold accents
- Feel: Significant achievement, double digits!
- Camera: 2:1 isometric, front-facing (south) view
- Background: Transparent/white
- No ground shadows`
  },
  {
    id: 'first-workout',
    name: 'First Workout',
    size: '1x1',
    prompt: `Create an isometric "First Workout" milestone marker for a health journey game:
- Style: Modern fitness, energetic
- Size: 1x1 tile footprint (44x22 pixels base)
- Elements: Small gym equipment icon or dumbbell monument on pedestal
- Colors: Energetic oranges, fitness blues
- Feel: Action-oriented, motivating
- Camera: 2:1 isometric, front-facing (south) view
- Background: Transparent/white
- No ground shadows`
  },
  {
    id: 'meal-logged',
    name: 'First Meal Logged',
    size: '1x1',
    prompt: `Create an isometric "First Meal Logged" milestone marker for a health journey game:
- Style: Modern nutrition, clean
- Size: 1x1 tile footprint (44x22 pixels base)
- Elements: Small food/plate icon or nutrition tracking symbol on stand
- Colors: Fresh food greens, warm appetizing colors
- Feel: Healthy eating awareness
- Camera: 2:1 isometric, front-facing (south) view
- Background: Transparent/white
- No ground shadows`
  },
  {
    id: 'q1-complete',
    name: 'Quarter 1 Complete',
    size: '3x3',
    prompt: `Create an isometric "Quarter 1 Complete" landmark building for a health journey game:
- Style: Modern wellness center, substantial
- Size: 3x3 tile footprint
- Elements: Wellness pavilion with "Q1" banner, garden elements, achievement flags
- Colors: Spring greens, fresh blues, celebratory gold
- Feel: Major milestone - first quarter of health journey complete
- Camera: 2:1 isometric, front-facing (south) view
- Background: Transparent/white
- No ground shadows`
  }
];

/**
 * Generate a sprite using Gemini via OpenRouter
 */
async function generateSprite(milestone) {
  console.log(`\nGenerating: ${milestone.name}...`);
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://ohw-health-journey.local',
      'X-Title': 'OHW Health Journey Sprite Generator'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free', // Free tier for testing
      messages: [
        {
          role: 'user',
          content: milestone.prompt
        }
      ],
      // Request image generation
      response_format: { type: 'text' }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log(`Response for ${milestone.name}:`, JSON.stringify(data, null, 2).slice(0, 500));
  
  return data;
}

/**
 * Generate image using Gemini's native image generation
 */
async function generateImage(milestone) {
  console.log(`\nGenerating image: ${milestone.name}...`);
  
  // Use the Gemini image generation endpoint
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': OPENROUTER_API_KEY.replace('sk-or-v1-', '') // Try with the key
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: milestone.prompt
        }]
      }],
      generationConfig: {
        responseModalities: ['image', 'text'],
        responseMimeType: 'image/png'
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.log('Direct Gemini API error:', error);
    return null;
  }

  const data = await response.json();
  return data;
}

/**
 * Main generation function
 */
async function main() {
  console.log('=== OHW Health Journey Sprite Generator ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Milestones to generate: ${MILESTONES.length}`);
  
  // Test with first milestone
  const testMilestone = MILESTONES[0];
  
  try {
    // Try OpenRouter first
    console.log('\n--- Testing OpenRouter API ---');
    const result = await generateSprite(testMilestone);
    
    // Save response for inspection
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'api-response.json'),
      JSON.stringify(result, null, 2)
    );
    console.log('\nAPI response saved to output/api-response.json');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
