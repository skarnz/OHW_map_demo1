#!/usr/bin/env npx ts-node
/**
 * Asset generation script using Gemini via OpenRouter.
 *
 * Usage:
 *   npx ts-node scripts/generate-assets.ts
 *   npx ts-node scripts/generate-assets.ts --biome wilderness
 *   npx ts-node scripts/generate-assets.ts --type nodes
 *   npx ts-node scripts/generate-assets.ts --dry-run
 *
 * Reads OPENROUTER_API_KEY from env or from engine/.env.local.
 * Generated images are 1024x1024 from the API, then resized to target
 * dimensions using sharp (if available) or saved as-is for manual resize.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');

// Read API key
let API_KEY = process.env.OPENROUTER_API_KEY || '';
if (!API_KEY) {
  const envPath = path.join(__dirname, '../../engine/.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/OPENROUTER_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
  }
}

const MODEL = 'google/gemini-2.5-flash-image';

interface GenerationJob {
  outputPath: string;
  prompt: string;
  width: number;
  height: number;
}

const BIOME_STYLES: Record<string, string> = {
  wilderness: 'lush green forest clearing, earthy tones, wild flowers, pine trees, moss-covered rocks, nature path',
  town: 'small cozy medieval town, warm brick and wood buildings, cobblestone streets, market stalls, lanterns',
  suburbs: 'clean modern suburban neighborhood, white picket fences, neat green lawns, modern houses, garden flowers',
  city: 'modern urban cityscape, glass and steel buildings, clean wide sidewalks, street lamps, urban park',
};

function buildJobs(filter?: { biome?: string; type?: string }): GenerationJob[] {
  const jobs: GenerationJob[] = [];

  const biomes = filter?.biome ? [filter.biome] : ['wilderness', 'town', 'suburbs', 'city'];
  const types = filter?.type ? [filter.type] : ['tiles', 'nodes', 'avatar'];

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
          prompt: `Create a seamless, tileable 2D game tile viewed from directly above (orthogonal top-down view). Style: smooth cartoon pixel art inspired by TinySwords and Pixelfrog games. Biome theme: ${BIOME_STYLES[biome]}. Tile surface: ${tile}. Use soft gradients with a warm, inviting color palette. The tile must be seamlessly tileable on all four edges. No perspective, no shadows, no 3D effects. Fill the entire image with the tile pattern.`,
          width: 48,
          height: 48,
        });
      }
    }
  }

  if (types.includes('nodes')) {
    const nodeIcons = [
      { name: 'week-locked', prompt: 'A locked silver padlock icon, greyed out metallic look, centered on transparent background' },
      { name: 'week-unlocked', prompt: 'An open padlock icon glowing bright blue, celebratory feel, centered on transparent background' },
      { name: 'week-completed', prompt: 'A bright green circle with a bold white checkmark inside, celebration confetti particles, centered on transparent background' },
      { name: 'day-locked', prompt: 'A small calendar page icon with a tiny lock symbol, greyed out, centered on transparent background' },
      { name: 'day-unlocked', prompt: 'A calendar page icon with today highlighted in bright blue, warm glow, centered on transparent background' },
      { name: 'day-completed', prompt: 'A calendar page icon with a green checkmark overlay, celebration sparkles, centered on transparent background' },
      { name: 'task-medication', prompt: 'A colorful medication pill capsule icon, half blue half white, with a small heart, health app style, centered on transparent background' },
      { name: 'task-nutrition', prompt: 'A fresh colorful salad bowl icon with visible lettuce, tomato and carrot, health food style, centered on transparent background' },
      { name: 'task-movement', prompt: 'An energetic running figure icon in bright orange, dynamic motion lines, fitness app style, centered on transparent background' },
      { name: 'task-wellness', prompt: 'A person sitting in meditation pose, soft purple gradient, peaceful aura glow, wellness app style, centered on transparent background' },
      { name: 'task-checkin', prompt: 'A clipboard with a teal checkmark, friendly rounded style, health check-in theme, centered on transparent background' },
    ];

    for (const icon of nodeIcons) {
      jobs.push({
        outputPath: path.join(ASSETS_DIR, 'nodes', `${icon.name}.png`),
        prompt: `Create a clean 2D game icon for a mobile health game. ${icon.prompt}. Style: smooth vector-like rendering, rounded shapes, soft shadows. The icon should be clearly recognizable at small sizes (48x48 pixels). White or transparent background. No text.`,
        width: 48,
        height: 48,
      });
    }
  }

  if (types.includes('avatar')) {
    const avatarFrames = [
      ...Array.from({ length: 4 }, (_, i) => ({
        dir: 'idle',
        frame: i + 1,
        prompt: `standing idle with slight breathing motion, frame ${i + 1} of 4 in a breathing cycle (${i === 0 ? 'neutral' : i === 1 ? 'chest slightly expanded' : i === 2 ? 'fully expanded' : 'returning to neutral'})`,
      })),
      ...Array.from({ length: 6 }, (_, i) => ({
        dir: 'walk',
        frame: i + 1,
        prompt: `walking to the right, walk cycle frame ${i + 1} of 6 (${['left foot forward', 'passing', 'right foot forward', 'both feet close', 'left foot back', 'returning'][i]})`,
      })),
      ...Array.from({ length: 6 }, (_, i) => ({
        dir: 'celebrate',
        frame: i + 1,
        prompt: `jumping celebration with arms raised, frame ${i + 1} of 6 (${['crouching to jump', 'launching up', 'peak height arms up', 'peak with sparkles', 'coming down', 'landing with fist pump'][i]})`,
      })),
    ];

    for (const f of avatarFrames) {
      jobs.push({
        outputPath: path.join(ASSETS_DIR, 'avatar', f.dir, `frame${f.frame}.png`),
        prompt: `Create a single frame of a cute cartoon game character sprite. The character is a friendly adventurer with a round head, simple features, wearing a blue shirt and brown pants. Side view facing right. Pose: ${f.prompt}. Style: TinySwords/Pixelfrog pixel art aesthetic but smooth and anti-aliased. Clean transparent background. The character should be about 3 heads tall (chibi proportions). Consistent character design - same outfit, same proportions, same colors across all frames.`,
        width: 48,
        height: 64,
      });
    }
  }

  return jobs;
}

async function generateWithGemini(job: GenerationJob): Promise<boolean> {
  if (!API_KEY) {
    console.log(`  [SKIP] No API key - keeping existing for ${path.basename(job.outputPath)}`);
    return false;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ohw-health-journey.local',
        'X-Title': 'OHW Journey Map Asset Generator',
      },
      body: JSON.stringify({
        model: MODEL,
        modalities: ['image', 'text'],
        messages: [{ role: 'user', content: job.prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`  [WARN] API returned ${response.status} for ${path.basename(job.outputPath)}: ${errorText.slice(0, 200)}`);
      return false;
    }

    const data = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
          images?: Array<{
            type?: string;
            image_url?: { url?: string };
          }>;
        };
      }>;
      error?: { message?: string };
    };

    if (data.error) {
      console.warn(`  [WARN] API error: ${data.error.message}`);
      return false;
    }

    const images = data.choices?.[0]?.message?.images;
    if (!images || images.length === 0) {
      console.warn(`  [WARN] No images returned for ${path.basename(job.outputPath)}`);
      return false;
    }

    const imageUrl = images[0].image_url?.url;
    if (!imageUrl || !imageUrl.startsWith('data:image')) {
      console.warn(`  [WARN] Invalid image data for ${path.basename(job.outputPath)}`);
      return false;
    }

    const base64Data = imageUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    ensureDir(path.dirname(job.outputPath));

    // Resize to target dimensions using Python (available on macOS)
    const tempPath = job.outputPath + '.orig.png';
    fs.writeFileSync(tempPath, buffer);

    const resized = await resizeImage(tempPath, job.outputPath, job.width, job.height);
    if (resized) {
      fs.unlinkSync(tempPath);
      const stats = fs.statSync(job.outputPath);
      console.log(`  [OK] ${path.basename(job.outputPath)} (${job.width}x${job.height}, ${(stats.size / 1024).toFixed(1)}KB)`);
    } else {
      // Resize failed -- keep original and rename
      fs.renameSync(tempPath, job.outputPath);
      console.log(`  [OK] ${path.basename(job.outputPath)} (1024x1024, resize failed - saved original)`);
    }

    return true;
  } catch (err) {
    console.warn(`  [ERR] ${err} for ${path.basename(job.outputPath)}`);
    return false;
  }
}

async function resizeImage(inputPath: string, outputPath: string, w: number, h: number): Promise<boolean> {
  const { execSync } = await import('child_process');
  try {
    execSync(
      `python3 -c "from PIL import Image; img=Image.open('${inputPath}'); img=img.resize((${w},${h}), Image.LANCZOS); img.save('${outputPath}')"`,
      { timeout: 10000 },
    );
    return true;
  } catch {
    // Try sips (macOS built-in) as fallback
    try {
      fs.copyFileSync(inputPath, outputPath);
      execSync(`sips -z ${h} ${w} '${outputPath}'`, { timeout: 10000, stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }
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
  const dryRun = args.includes('--dry-run');

  const filter = { biome: biomeArg, type: typeArg };

  console.log('OHW Journey Map - Asset Generator');
  console.log('=================================');
  console.log(`API Key: ${API_KEY ? 'Set' : 'NOT SET (will skip generation)'}`);
  console.log(`Model: ${MODEL}`);
  console.log(`Filter: biome=${filter.biome || 'all'}, type=${filter.type || 'all'}`);
  console.log('');

  const jobs = buildJobs(filter);
  console.log(`${dryRun ? 'Would generate' : 'Generating'} ${jobs.length} assets...\n`);

  if (dryRun) {
    for (const job of jobs) {
      const exists = fs.existsSync(job.outputPath);
      console.log(`  ${exists ? '[EXISTS]' : '[MISSING]'} ${path.relative(ASSETS_DIR, job.outputPath)} (${job.width}x${job.height})`);
    }
    const cost = jobs.length * 0.039;
    console.log(`\nEstimated cost: ~$${cost.toFixed(2)} (${jobs.length} images @ ~$0.039/image)`);
    return;
  }

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const job of jobs) {
    const ok = await generateWithGemini(job);
    if (ok) success++;
    else if (!API_KEY) skipped++;
    else failed++;

    // Rate limit: 2 second delay between requests to avoid 429s
    if (API_KEY) await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\nDone: ${success} generated, ${failed} failed, ${skipped} skipped`);
  if (success > 0) {
    const cost = success * 0.039;
    console.log(`Estimated cost: ~$${cost.toFixed(2)}`);
  }
}

main().catch(console.error);
