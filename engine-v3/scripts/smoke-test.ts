/**
 * Smoke test: imports and exercises core game logic modules.
 * Catches import errors, type mismatches, and logic bugs
 * without needing a GL context or device.
 * 
 * Run: npx ts-node scripts/smoke-test.ts
 */

import { canTransition, transitionNode, VALID_TRANSITIONS } from '../src/game/contracts';
import type { NodeState, GameSceneProps, GameSceneCallbacks, PathNode } from '../src/game/contracts';
import { getPathConfig, PATH_CONFIGS } from '../src/data/journey-paths';
import { COLORS, BIOME_PALETTES, TYPOGRAPHY, SPACING, getSeasonalPalette, SEASON_TINTS } from '../src/theme/tokens';
import { ASSET_MANIFEST, getRequiredAssets, getMissingAssets } from '../src/game/assets/manifest';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${msg}`);
  }
}

console.log('=== OHW Engine V3 Smoke Test ===\n');

// --- Contracts ---
console.log('1. Contracts & State Machine');
assert(canTransition('locked', 'unlocked'), 'locked -> unlocked');
assert(!canTransition('locked', 'completed'), 'locked -> completed should fail');
assert(canTransition('unlocked', 'in_progress'), 'unlocked -> in_progress');
assert(canTransition('unlocked', 'skipped'), 'unlocked -> skipped');
assert(canTransition('in_progress', 'completed'), 'in_progress -> completed');
assert(!canTransition('completed', 'locked'), 'completed is terminal');
assert(!canTransition('skipped', 'unlocked'), 'skipped is terminal');
assert(transitionNode('locked', 'unlocked') === 'unlocked', 'transitionNode locked->unlocked');
assert(transitionNode('locked', 'completed') === 'locked', 'transitionNode invalid stays same');

const allStates: NodeState[] = ['locked', 'unlocked', 'in_progress', 'completed', 'skipped'];
for (const state of allStates) {
  assert(state in VALID_TRANSITIONS, `${state} in VALID_TRANSITIONS`);
}

// --- Path Configs ---
console.log('2. Path Configs');
const configs = ['4-week', '8-week', '12-week', '24-week'];
for (const key of configs) {
  const config = PATH_CONFIGS[key];
  assert(!!config, `${key} config exists`);
  assert(config.monthlyPath.length === config.weekCount, `${key} monthlyPath length matches weekCount`);
  assert(Object.keys(config.weeklyPaths).length === config.weekCount, `${key} weeklyPaths count matches weekCount`);
  assert(config.dailyLayout.length === 5, `${key} dailyLayout has 5 tasks`);

  // Verify all path nodes have valid fields
  for (const node of config.monthlyPath) {
    assert(typeof node.x === 'number' && typeof node.y === 'number', `${key} node ${node.id} has x/y`);
    assert(node.type === 'week', `${key} monthly node type is week`);
  }
}

// Custom path generation
const custom = getPathConfig(16);
assert(custom.weekCount === 16, 'custom 16-week config');
assert(custom.monthlyPath.length === 16, 'custom 16-week has 16 nodes');
assert(Object.keys(custom.weeklyPaths).length === 16, 'custom 16-week has 16 weekly paths');

// Verify weekly paths have 7 days
const weekPath = custom.weeklyPaths['w1'];
assert(weekPath.length === 7, 'weekly path has 7 days');
for (const day of weekPath) {
  assert(day.type === 'day', 'weekly node type is day');
}

// Daily layout has task categories
const daily = custom.dailyLayout;
const categories = daily.map(d => d.category).filter(Boolean);
assert(categories.length === 5, 'all 5 daily tasks have categories');

// --- Theme Tokens ---
console.log('3. Theme Tokens');
assert(!!COLORS.bgPrimary, 'COLORS.bgPrimary exists');
assert(!!COLORS.accentBlue, 'COLORS.accentBlue exists');
assert(!!COLORS.nodeCompleted, 'COLORS.nodeCompleted exists');
assert(typeof BIOME_PALETTES.wilderness.ground === 'number', 'wilderness ground is hex number');
assert(typeof BIOME_PALETTES.city.path === 'number', 'city path is hex number');
const biomes = ['wilderness', 'town', 'suburbs', 'city'] as const;
for (const biome of biomes) {
  const p = BIOME_PALETTES[biome];
  assert(!!p.ground && !!p.path && !!p.water && !!p.accent, `${biome} palette complete`);
}
assert(TYPOGRAPHY.h1.size === 26, 'h1 size');
assert(SPACING.screenPadding === 20, 'screen padding');

// --- Asset Manifest ---
console.log('4. Asset Manifest');
const assetCount = Object.keys(ASSET_MANIFEST.assets).length;
assert(assetCount > 30, `manifest has ${assetCount} assets (expected >30)`);
assert(ASSET_MANIFEST.version === '1.1.0', 'manifest version');

const required = getRequiredAssets();
assert(required.length > 10, `${required.length} required assets`);

const allMissing = getMissingAssets(new Set());
assert(allMissing.length === required.length, 'all assets missing when set empty');

const noneMissing = getMissingAssets(new Set(required));
assert(noneMissing.length === 0, 'no assets missing when all provided');

const partialSet = new Set(required.slice(0, 1));
const partialMissing = getMissingAssets(partialSet);
assert(partialMissing.length === required.length - 1, 'getMissingAssets partial calculation');

// Verify all required assets exist on disk
import { existsSync } from 'fs';
import { resolve } from 'path';
const assetsDir = resolve(__dirname, '../src/assets');
let missingOnDisk = 0;
for (const assetPath of required) {
  const fullPath = resolve(assetsDir, assetPath);
  if (!existsSync(fullPath)) {
    console.error(`  MISSING ON DISK: ${assetPath}`);
    missingOnDisk++;
  }
}
assert(missingOnDisk === 0, `${missingOnDisk} required assets missing on disk`);

// Verify all manifest entries point to files that exist (non-required too)
let manifestMissingOnDisk = 0;
for (const [key] of Object.entries(ASSET_MANIFEST.assets)) {
  const fullPath = resolve(assetsDir, key);
  if (!existsSync(fullPath)) {
    manifestMissingOnDisk++;
  }
}
assert(manifestMissingOnDisk === 0, `${manifestMissingOnDisk} manifest entries missing on disk`);

// --- Cross-module consistency ---
console.log('5. Cross-module Consistency');

// Verify all biomes in BIOME_PALETTES match the Biome type
const biomeTypes = ['wilderness', 'town', 'suburbs', 'city'];
for (const b of biomeTypes) {
  assert(b in BIOME_PALETTES, `${b} in BIOME_PALETTES`);
}

// Verify daily layout task categories match the TaskCategory type
const validCategories = ['medication', 'nutrition', 'movement', 'wellness', 'checkin'];
for (const task of daily) {
  assert(validCategories.includes(task.category!), `${task.id} has valid category ${task.category}`);
}

// Verify node coordinate sanity (no NaN, reasonable ranges)
// Monthly/weekly paths use normalized X (0..1), Y is absolute pixels
for (const config of Object.values(PATH_CONFIGS)) {
  for (const node of config.monthlyPath) {
    assert(!isNaN(node.x) && !isNaN(node.y), `${config.id} ${node.id} no NaN`);
    assert(node.x >= 0 && node.x <= 1, `${config.id} ${node.id} normalized x in range (${node.x})`);
    assert(node.y >= 0 && node.y <= 7000, `${config.id} ${node.id} y in range (${node.y})`);
  }
}

// --- Seasonal Palettes ---
console.log('6. Seasonal Palette System');

const allSeasons = ['spring', 'summer', 'fall', 'winter'] as const;
const allBiomes = ['wilderness', 'town', 'suburbs', 'city'] as const;

for (const season of allSeasons) {
  assert(season in SEASON_TINTS, `${season} tint exists`);
}

for (const biome of allBiomes) {
  for (const season of allSeasons) {
    const p = getSeasonalPalette(biome, season);
    assert(typeof p.ground === 'number' && p.ground >= 0 && p.ground <= 0xFFFFFF, `${biome}/${season} ground valid`);
    assert(typeof p.path === 'number' && p.path >= 0 && p.path <= 0xFFFFFF, `${biome}/${season} path valid`);
    assert(typeof p.water === 'number' && p.water >= 0 && p.water <= 0xFFFFFF, `${biome}/${season} water valid`);
    assert(typeof p.accent === 'number' && p.accent >= 0 && p.accent <= 0xFFFFFF, `${biome}/${season} accent valid`);
  }
}

// Spring should differ from winter for same biome
const wSpring = getSeasonalPalette('wilderness', 'spring');
const wWinter = getSeasonalPalette('wilderness', 'winter');
assert(wSpring.ground !== wWinter.ground, 'wilderness spring/winter ground differ');

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
