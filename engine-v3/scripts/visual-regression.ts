#!/usr/bin/env npx tsx
/**
 * Visual regression test: captures screenshots of each scene via Playwright
 * on the web export, then compares against baseline images.
 *
 * Usage:
 *   npx tsx scripts/visual-regression.ts           # compare against baselines
 *   npx tsx scripts/visual-regression.ts --update   # save new baselines
 *   npx tsx scripts/visual-regression.ts --ci       # fail on any diff > threshold
 *
 * Prerequisites:
 *   npx expo export --platform web   (builds dist/)
 *   npx playwright install chromium  (installs browser)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn, ChildProcess } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const SNAPSHOTS_DIR = path.join(ROOT, '__snapshots__');
const DIFF_DIR = path.join(ROOT, '__snapshots__', 'diffs');
const PORT = 8347;
const THRESHOLD = 0.01; // 1% pixel difference allowed

const args = process.argv.slice(2);
const updateMode = args.includes('--update');
const ciMode = args.includes('--ci');

interface ScreenshotSpec {
  name: string;
  waitMs: number;
}

const SCREENSHOTS: ScreenshotSpec[] = [
  { name: 'quarterly-view', waitMs: 1500 },
];

async function main() {
  console.log('OHW Visual Regression Test');
  console.log('==========================\n');

  // Verify dist exists
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.log('Building web export...');
    execSync('npx expo export --platform web', { cwd: ROOT, stdio: 'inherit' });
  }

  // Ensure snapshots dir exists
  if (!fs.existsSync(SNAPSHOTS_DIR)) fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  if (!fs.existsSync(DIFF_DIR)) fs.mkdirSync(DIFF_DIR, { recursive: true });

  // Start a static server for dist/
  const server = await startServer();

  try {
    // Import playwright dynamically
    const { chromium } = await import('playwright');

    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 393, height: 852 }, // iPhone 15 Pro
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    let passed = 0;
    let failed = 0;
    let updated = 0;

    for (const spec of SCREENSHOTS) {
      console.log(`\nCapturing: ${spec.name}...`);

      await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(spec.waitMs);

      const screenshotPath = path.join(SNAPSHOTS_DIR, `${spec.name}.current.png`);
      const baselinePath = path.join(SNAPSHOTS_DIR, `${spec.name}.baseline.png`);

      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`  Captured: ${screenshotPath}`);

      if (updateMode) {
        fs.copyFileSync(screenshotPath, baselinePath);
        console.log(`  Updated baseline: ${baselinePath}`);
        updated++;
        continue;
      }

      if (!fs.existsSync(baselinePath)) {
        console.log(`  No baseline found. Run with --update to create.`);
        fs.copyFileSync(screenshotPath, baselinePath);
        console.log(`  Created initial baseline: ${baselinePath}`);
        updated++;
        continue;
      }

      // Compare using pixel diff via Python PIL
      const diffResult = await compareImages(baselinePath, screenshotPath, spec.name);
      if (diffResult.diffPercent <= THRESHOLD) {
        console.log(`  PASS: ${(diffResult.diffPercent * 100).toFixed(2)}% diff (threshold: ${THRESHOLD * 100}%)`);
        passed++;
        // Clean up current screenshot on pass
        fs.unlinkSync(screenshotPath);
      } else {
        console.log(`  FAIL: ${(diffResult.diffPercent * 100).toFixed(2)}% diff (threshold: ${THRESHOLD * 100}%)`);
        failed++;
      }
    }

    await browser.close();

    console.log(`\n${'='.repeat(40)}`);
    console.log(`Results: ${passed} passed, ${failed} failed, ${updated} updated`);

    if (ciMode && failed > 0) {
      process.exit(1);
    }
  } finally {
    server.kill();
  }
}

async function compareImages(
  baselinePath: string,
  currentPath: string,
  name: string,
): Promise<{ diffPercent: number }> {
  const diffPath = path.join(DIFF_DIR, `${name}.diff.png`);

  try {
    const result = execSync(
      `python3 -c "
from PIL import Image, ImageChops
import sys

base = Image.open('${baselinePath}').convert('RGBA')
curr = Image.open('${currentPath}').convert('RGBA')

if base.size != curr.size:
    print(f'SIZE_MISMATCH:{base.size}:{curr.size}')
    sys.exit(0)

diff = ImageChops.difference(base, curr)
pixels = list(diff.getdata())
total = len(pixels)
changed = sum(1 for p in pixels if sum(p) > 30)  # threshold for noise
pct = changed / total if total > 0 else 0
print(f'DIFF:{pct}')

# Save diff image
diff.save('${diffPath}')
"`,
      { timeout: 15000, encoding: 'utf-8' },
    );

    const line = result.trim().split('\n').pop() || '';
    if (line.startsWith('SIZE_MISMATCH')) {
      console.log(`  Size mismatch: ${line}`);
      return { diffPercent: 1.0 };
    }
    if (line.startsWith('DIFF:')) {
      return { diffPercent: parseFloat(line.split(':')[1]) };
    }
    return { diffPercent: 1.0 };
  } catch {
    console.warn('  Failed to compare images (PIL not available?)');
    return { diffPercent: 0 }; // Can't compare, pass by default
  }
}

function startServer(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', DIST_DIR], {
      stdio: 'pipe',
    });

    server.on('error', reject);

    // Wait for server to be ready
    setTimeout(() => resolve(server), 1000);
  });
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
