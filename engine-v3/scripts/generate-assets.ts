#!/usr/bin/env npx ts-node
/**
 * Asset generation script using Gemini (Nano Banana workflow)
 * 
 * Usage:
 *   OPENROUTER_API_KEY=... npx ts-node scripts/generate-assets.ts
 *   OPENROUTER_API_KEY=... npx ts-node scripts/generate-assets.ts --biome wilderness
 *   OPENROUTER_API_KEY=... npx ts-node scripts/generate-assets.ts --type nodes
 * 
 * This generates placeholder PNG assets for the journey map.
 * Run once during development, then hand-curate results.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');

// Read API key from env or from engine/.env.local
let API_KEY = process.env.OPENROUTER_API_KEY || '';
if (!API_KEY) {
  const envPath = path.join(__dirname, '../../engine/.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/OPENROUTER_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
  }
}
const MODEL = 'google/gemini-2.0-flash-exp:free'; // Free tier, confirmed working for image gen

interface GenerationJob {
  outputPath: string;
  prompt: string;
  width: number;
  height: number;
}

const BIOME_STYLES: Record<string, string> = {
  wilderness: 'lush green forest, nature, earthy tones, wild flowers, pine trees',
  town: 'small cozy town, warm brick buildings, cobblestone paths, market stalls',
  suburbs: 'clean suburban neighborhood, white picket fences, neat lawns, modern houses',
  city: 'modern urban cityscape, glass buildings, clean sidewalks, bright lights',
};

function buildJobs(filter?: { biome?: string; type?: string }): GenerationJob[] {
  const jobs: GenerationJob[] = [];

  const biomes = filter?.biome ? [filter.biome] : ['wilderness', 'town', 'suburbs', 'city'];
  const types = filter?.type ? [filter.type] : ['tiles', 'nodes', 'avatar'];

  // Tile assets
  if (types.includes('tiles')) {
    const tileTypes: Record<string, string[]> = {
      wilderness: ['grass', 'dirt-path', 'water'],
      town: ['grass', 'cobble'],
      suburbs: ['lawn', 'sidewalk'],
      city: ['asphalt', 'concrete'],
    };

    for (const biome of biomes) {
      const tiles = tileTypes[biome] || [];
      for (const tile of tiles) {
        jobs.push({
          outputPath: path.join(ASSETS_DIR, 'tiles', biome, `${tile}.png`),
          prompt: `Create a 48x48 pixel orthogonal top-down game tile. Style: smooth cartoon pixel art, TinySwords/Pixelfrog aesthetic. Biome: ${BIOME_STYLES[biome]}. Tile type: ${tile}. Seamless tileable. Transparent background where appropriate. Soft gradients, warm palette. NO harsh edges.`,
          width: 48,
          height: 48,
        });
      }
    }
  }

  // Node icons
  if (types.includes('nodes')) {
    const nodeIcons = [
      { name: 'week-locked', prompt: 'A locked padlock icon, greyed out, game UI style' },
      { name: 'week-unlocked', prompt: 'An open padlock icon, bright blue highlight, game UI style' },
      { name: 'week-completed', prompt: 'A green checkmark in a circle, celebration, game UI style' },
      { name: 'day-locked', prompt: 'A small locked calendar icon, greyed out, game UI style' },
      { name: 'day-unlocked', prompt: 'A calendar icon with today highlighted in blue, game UI style' },
      { name: 'day-completed', prompt: 'A calendar icon with green check, game UI style' },
      { name: 'task-medication', prompt: 'A pill/medication capsule icon, blue and white, health app style' },
      { name: 'task-nutrition', prompt: 'A fresh salad bowl icon, green and colorful, health app style' },
      { name: 'task-movement', prompt: 'A running figure icon, energetic orange, fitness app style' },
      { name: 'task-wellness', prompt: 'A meditation/yoga icon, peaceful purple, wellness app style' },
      { name: 'task-checkin', prompt: 'A clipboard with checkmark icon, teal, health app style' },
    ];

    for (const icon of nodeIcons) {
      jobs.push({
        outputPath: path.join(ASSETS_DIR, 'nodes', `${icon.name}.png`),
        prompt: `Create a 48x48 pixel game icon. ${icon.prompt}. Clean vector-like rendering. Transparent background. Rounded corners. Suitable for mobile game UI.`,
        width: 48,
        height: 48,
      });
    }
  }

  // Avatar sprites
  if (types.includes('avatar')) {
    const avatarFrames = [
      ...Array.from({ length: 4 }, (_, i) => ({
        dir: 'idle',
        frame: i + 1,
        prompt: `standing idle, slight breathing animation frame ${i + 1}/4`,
      })),
      ...Array.from({ length: 6 }, (_, i) => ({
        dir: 'walk',
        frame: i + 1,
        prompt: `walking right, walk cycle frame ${i + 1}/6`,
      })),
      ...Array.from({ length: 6 }, (_, i) => ({
        dir: 'celebrate',
        frame: i + 1,
        prompt: `jumping celebration, arms up, frame ${i + 1}/6`,
      })),
    ];

    for (const f of avatarFrames) {
      jobs.push({
        outputPath: path.join(ASSETS_DIR, 'avatar', f.dir, `frame${f.frame}.png`),
        prompt: `Create a 48x64 pixel game character sprite. Cute cartoon adventurer character, ${f.prompt}. TinySwords/Pixelfrog art style. Side view. Transparent background. Consistent character design across all frames.`,
        width: 48,
        height: 64,
      });
    }
  }

  return jobs;
}

async function generateWithGemini(job: GenerationJob): Promise<boolean> {
  if (!API_KEY) {
    console.log(`  [SKIP] No API key - creating placeholder for ${path.basename(job.outputPath)}`);
    createPlaceholder(job);
    return true;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-generation',
        messages: [{ role: 'user', content: job.prompt }],
        provider: {
          google: {
            responseModalities: ['IMAGE'],
            imageConfig: { aspectRatio: job.width === job.height ? '1:1' : '3:4' },
          },
        },
      }),
    });

    if (!response.ok) {
      console.warn(`  [WARN] API returned ${response.status} for ${path.basename(job.outputPath)}`);
      createPlaceholder(job);
      return false;
    }

    const data = await response.json();
    const imageContent = data?.choices?.[0]?.message?.content;

    if (imageContent && typeof imageContent === 'string' && imageContent.startsWith('data:image')) {
      const base64Data = imageContent.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      ensureDir(path.dirname(job.outputPath));
      fs.writeFileSync(job.outputPath, buffer);
      console.log(`  [OK] Generated ${path.basename(job.outputPath)}`);
      return true;
    }

    console.warn(`  [WARN] No image in response for ${path.basename(job.outputPath)}`);
    createPlaceholder(job);
    return false;
  } catch (err) {
    console.warn(`  [ERR] ${err} - creating placeholder for ${path.basename(job.outputPath)}`);
    createPlaceholder(job);
    return false;
  }
}

function createPlaceholder(job: GenerationJob) {
  // Create a minimal 1x1 transparent PNG as placeholder
  const PNG_HEADER = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x62, 0x00, 0x00, 0x00, 0x02,
    0x00, 0x01, 0xE5, 0x27, 0xDE, 0xFC, 0x00, 0x00,
    0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42,
    0x60, 0x82,
  ]);

  ensureDir(path.dirname(job.outputPath));
  fs.writeFileSync(job.outputPath, PNG_HEADER);
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const biomeArg = args.find(a => a.startsWith('--biome'))?.split('=')[1]
    || (args.indexOf('--biome') >= 0 ? args[args.indexOf('--biome') + 1] : undefined);
  const typeArg = args.find(a => a.startsWith('--type'))?.split('=')[1]
    || (args.indexOf('--type') >= 0 ? args[args.indexOf('--type') + 1] : undefined);

  const filter = {
    biome: biomeArg,
    type: typeArg,
  };

  console.log('OHW Journey Map - Asset Generator');
  console.log('=================================');
  console.log(`API Key: ${API_KEY ? 'Set' : 'NOT SET (will create placeholders)'}`);
  console.log(`Filter: biome=${filter.biome || 'all'}, type=${filter.type || 'all'}`);
  console.log('');

  const jobs = buildJobs(filter);
  console.log(`Generating ${jobs.length} assets...\n`);

  let success = 0;
  let failed = 0;

  for (const job of jobs) {
    const ok = await generateWithGemini(job);
    if (ok) success++;
    else failed++;

    // Rate limit: 100ms between requests
    if (API_KEY) await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDone: ${success} generated, ${failed} failed`);
}

main().catch(console.error);
