/**
 * Smoke test: imports and exercises core game logic modules.
 * Catches import errors, type mismatches, and logic bugs
 * without needing a GL context or device.
 *
 * Run: npx tsx scripts/smoke-test.ts
 */

import {
  canTransition,
  transitionNode,
  VALID_TRANSITIONS,
  QUARTER_BIOMES,
} from '../src/game/contracts';
import type { NodeState, PathNode } from '../src/game/contracts';
import { getPathConfig, PATH_CONFIGS } from '../src/data/journey-paths';
import {
  COLORS,
  BIOME_PALETTES,
  TYPOGRAPHY,
  SPACING,
  getSeasonalPalette,
  SEASON_TINTS,
} from '../src/theme/tokens';
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

// --- 1. Contracts & State Machine (exhaustive) ---
console.log('1. Contracts & State Machine');

const allStates: NodeState[] = ['locked', 'unlocked', 'in_progress', 'completed', 'skipped'];

// Every state present in VALID_TRANSITIONS
for (const state of allStates) {
  assert(state in VALID_TRANSITIONS, `${state} in VALID_TRANSITIONS`);
}

// Exhaustive valid transitions
assert(canTransition('locked', 'unlocked'), 'locked -> unlocked');
assert(canTransition('unlocked', 'in_progress'), 'unlocked -> in_progress');
assert(canTransition('unlocked', 'skipped'), 'unlocked -> skipped');
assert(canTransition('in_progress', 'completed'), 'in_progress -> completed');
assert(canTransition('in_progress', 'skipped'), 'in_progress -> skipped');

// Exhaustive invalid transitions
assert(!canTransition('locked', 'in_progress'), 'locked -/-> in_progress');
assert(!canTransition('locked', 'completed'), 'locked -/-> completed');
assert(!canTransition('locked', 'skipped'), 'locked -/-> skipped');
assert(!canTransition('locked', 'locked'), 'locked -/-> locked');
assert(!canTransition('unlocked', 'locked'), 'unlocked -/-> locked');
assert(!canTransition('unlocked', 'completed'), 'unlocked -/-> completed');
assert(!canTransition('unlocked', 'unlocked'), 'unlocked -/-> unlocked');
assert(!canTransition('in_progress', 'locked'), 'in_progress -/-> locked');
assert(!canTransition('in_progress', 'unlocked'), 'in_progress -/-> unlocked');
assert(!canTransition('in_progress', 'in_progress'), 'in_progress -/-> in_progress');
assert(!canTransition('completed', 'locked'), 'completed -/-> locked');
assert(!canTransition('completed', 'unlocked'), 'completed -/-> unlocked');
assert(!canTransition('completed', 'in_progress'), 'completed -/-> in_progress');
assert(!canTransition('completed', 'completed'), 'completed -/-> completed');
assert(!canTransition('completed', 'skipped'), 'completed -/-> skipped');
assert(!canTransition('skipped', 'locked'), 'skipped -/-> locked');
assert(!canTransition('skipped', 'unlocked'), 'skipped -/-> unlocked');
assert(!canTransition('skipped', 'in_progress'), 'skipped -/-> in_progress');
assert(!canTransition('skipped', 'completed'), 'skipped -/-> completed');
assert(!canTransition('skipped', 'skipped'), 'skipped -/-> skipped');

// Terminal states have no outgoing transitions
assert(VALID_TRANSITIONS['completed'].length === 0, 'completed is terminal');
assert(VALID_TRANSITIONS['skipped'].length === 0, 'skipped is terminal');

// Non-terminal states have at least one transition
assert(VALID_TRANSITIONS['locked'].length > 0, 'locked has transitions');
assert(VALID_TRANSITIONS['unlocked'].length > 0, 'unlocked has transitions');
assert(VALID_TRANSITIONS['in_progress'].length > 0, 'in_progress has transitions');

// transitionNode: valid transitions return target
assert(transitionNode('locked', 'unlocked') === 'unlocked', 'transitionNode locked->unlocked');
assert(transitionNode('unlocked', 'in_progress') === 'in_progress', 'transitionNode unlocked->in_progress');
assert(transitionNode('unlocked', 'skipped') === 'skipped', 'transitionNode unlocked->skipped');
assert(transitionNode('in_progress', 'completed') === 'completed', 'transitionNode in_progress->completed');
assert(transitionNode('in_progress', 'skipped') === 'skipped', 'transitionNode in_progress->skipped');

// transitionNode: invalid transitions return current state
assert(transitionNode('locked', 'completed') === 'locked', 'transitionNode invalid locked->completed stays locked');
assert(transitionNode('completed', 'locked') === 'completed', 'transitionNode invalid completed->locked stays completed');
assert(transitionNode('skipped', 'unlocked') === 'skipped', 'transitionNode invalid skipped->unlocked stays skipped');

// QUARTER_BIOMES mapping
assert(QUARTER_BIOMES[1] === 'wilderness', 'Q1 = wilderness');
assert(QUARTER_BIOMES[2] === 'town', 'Q2 = town');
assert(QUARTER_BIOMES[3] === 'suburbs', 'Q3 = suburbs');
assert(QUARTER_BIOMES[4] === 'city', 'Q4 = city');

// All quarters mapped
for (const q of [1, 2, 3, 4] as const) {
  assert(q in QUARTER_BIOMES, `quarter ${q} in QUARTER_BIOMES`);
  assert(typeof QUARTER_BIOMES[q] === 'string', `quarter ${q} biome is string`);
}

// --- 2. Path Configs ---
console.log('2. Path Configs');

const configs = ['4-week', '8-week', '12-week', '24-week'];
for (const key of configs) {
  const config = PATH_CONFIGS[key];
  assert(!!config, `${key} config exists`);
  assert(config.monthlyPath.length === config.weekCount, `${key} monthlyPath length matches weekCount`);
  assert(
    Object.keys(config.weeklyPaths).length === config.weekCount,
    `${key} weeklyPaths count matches weekCount`,
  );
  assert(config.dailyLayout.length === 5, `${key} dailyLayout has 5 tasks`);

  for (const node of config.monthlyPath) {
    assert(typeof node.x === 'number' && typeof node.y === 'number', `${key} node ${node.id} has x/y`);
    assert(node.type === 'week', `${key} monthly node type is week`);
  }
}

// getPathConfig(12) specifically
const config12 = getPathConfig(12);
assert(config12.weekCount === 12, '12-week config weekCount');
assert(config12.monthlyPath.length === 12, '12-week has 12 monthly nodes');
assert(Object.keys(config12.weeklyPaths).length === 12, '12-week has 12 weekly paths');
for (let i = 1; i <= 12; i++) {
  const weekKey = `w${i}`;
  assert(weekKey in config12.weeklyPaths, `12-week has weeklyPath ${weekKey}`);
  assert(config12.weeklyPaths[weekKey].length === 7, `12-week ${weekKey} has 7 day nodes`);
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
const categories = daily.map((d) => d.category).filter(Boolean);
assert(categories.length === 5, 'all 5 daily tasks have categories');

// Normalized X coordinates for ALL path configs
for (const [key, config] of Object.entries(PATH_CONFIGS)) {
  for (const node of config.monthlyPath) {
    assert(!isNaN(node.x) && !isNaN(node.y), `${key} ${node.id} no NaN`);
    assert(node.x > 0 && node.x < 1, `${key} ${node.id} normalized x in (0,1) range (${node.x})`);
    assert(node.y >= 0 && node.y <= 10000, `${key} ${node.id} y in valid range (${node.y})`);
  }

  for (const [weekId, days] of Object.entries(config.weeklyPaths)) {
    for (const day of days) {
      assert(!isNaN(day.x) && !isNaN(day.y), `${key} ${weekId} ${day.id} no NaN`);
      assert(day.x > 0 && day.x < 1, `${key} ${weekId} ${day.id} normalized x in (0,1) (${day.x})`);
      assert(day.y >= 0, `${key} ${weekId} ${day.id} y >= 0`);
    }
  }
}

// --- 3. Theme Tokens ---
console.log('3. Theme Tokens');
assert(!!COLORS.bgPrimary, 'COLORS.bgPrimary exists');
assert(!!COLORS.accentBlue, 'COLORS.accentBlue exists');
assert(!!COLORS.nodeCompleted, 'COLORS.nodeCompleted exists');
assert(!!COLORS.nodeLocked, 'COLORS.nodeLocked exists');
assert(!!COLORS.nodeUnlocked, 'COLORS.nodeUnlocked exists');
assert(!!COLORS.nodeInProgress, 'COLORS.nodeInProgress exists');
assert(!!COLORS.nodeSkipped, 'COLORS.nodeSkipped exists');
assert(!!COLORS.pathDefault, 'COLORS.pathDefault exists');
assert(!!COLORS.pathCompleted, 'COLORS.pathCompleted exists');

assert(typeof BIOME_PALETTES.wilderness.ground === 'number', 'wilderness ground is hex number');
assert(typeof BIOME_PALETTES.city.path === 'number', 'city path is hex number');
const biomes = ['wilderness', 'town', 'suburbs', 'city'] as const;
for (const biome of biomes) {
  const p = BIOME_PALETTES[biome];
  assert(!!p.ground && !!p.path && !!p.water && !!p.accent, `${biome} palette complete`);
  assert(p.ground >= 0 && p.ground <= 0xffffff, `${biome} ground in hex range`);
  assert(p.path >= 0 && p.path <= 0xffffff, `${biome} path in hex range`);
  assert(p.water >= 0 && p.water <= 0xffffff, `${biome} water in hex range`);
  assert(p.accent >= 0 && p.accent <= 0xffffff, `${biome} accent in hex range`);
}

assert(TYPOGRAPHY.h1.size === 26, 'h1 size');
assert(TYPOGRAPHY.h2.size === 18, 'h2 size');
assert(TYPOGRAPHY.body.size === 16, 'body size');
assert(TYPOGRAPHY.caption.size === 14, 'caption size');
assert(SPACING.screenPadding === 20, 'screen padding');
assert(SPACING.cardPadding === 18, 'card padding');
assert(SPACING.cardRadius === 16, 'card radius');

// --- 4. Asset Manifest ---
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

// Verify audio assets exist on disk with non-zero file size
import { statSync } from 'fs';
const audioFiles = ['tap.mp3', 'walk.mp3', 'celebrate.mp3', 'transition.mp3', 'complete.mp3'];
for (const audioFile of audioFiles) {
  const audioPath = resolve(assetsDir, 'audio', audioFile);
  assert(existsSync(audioPath), `audio/${audioFile} exists on disk`);
  if (existsSync(audioPath)) {
    const stat = statSync(audioPath);
    assert(stat.size > 100, `audio/${audioFile} is not empty (${stat.size} bytes)`);
  }
}

// Verify node icon assets exist on disk
const nodeIcons = [
  'week-locked.png', 'week-unlocked.png', 'week-completed.png',
  'day-locked.png', 'day-unlocked.png', 'day-completed.png',
  'task-medication.png', 'task-nutrition.png', 'task-movement.png',
  'task-wellness.png', 'task-checkin.png',
];
for (const icon of nodeIcons) {
  const iconPath = resolve(assetsDir, 'nodes', icon);
  assert(existsSync(iconPath), `nodes/${icon} exists on disk`);
  if (existsSync(iconPath)) {
    const stat = statSync(iconPath);
    assert(stat.size > 500, `nodes/${icon} is a real image (${stat.size} bytes)`);
  }
}

// Verify avatar sprite frames exist on disk
const avatarAnims = { idle: 4, walk: 6, celebrate: 6 };
for (const [anim, frameCount] of Object.entries(avatarAnims)) {
  for (let f = 1; f <= frameCount; f++) {
    const framePath = resolve(assetsDir, 'avatar', anim, `frame${f}.png`);
    assert(existsSync(framePath), `avatar/${anim}/frame${f}.png exists`);
    if (existsSync(framePath)) {
      const stat = statSync(framePath);
      assert(stat.size > 500, `avatar/${anim}/frame${f}.png is a real image (${stat.size} bytes)`);
    }
  }
}

// Verify skiaLoader exports
import {
  getNodeIconKey,
  getAvatarFrameKey,
} from '../src/game/assets/skiaLoader';

assert(getNodeIconKey('week', 'locked') === 'nodes/week-locked.png', 'skiaLoader week-locked key');
assert(getNodeIconKey('week', 'completed') === 'nodes/week-completed.png', 'skiaLoader week-completed key');
assert(getNodeIconKey('day', 'unlocked') === 'nodes/day-unlocked.png', 'skiaLoader day-unlocked key');
assert(getNodeIconKey('day', 'in_progress') === 'nodes/day-unlocked.png', 'skiaLoader day in_progress maps to unlocked');
assert(getNodeIconKey('day', 'skipped') === 'nodes/day-locked.png', 'skiaLoader day skipped maps to locked');
assert(getNodeIconKey('week', 'unlocked', 'medication') === 'nodes/task-medication.png', 'skiaLoader category overrides state');
assert(getNodeIconKey('week', 'locked', 'medication') === 'nodes/week-locked.png', 'skiaLoader locked ignores category');
assert(getAvatarFrameKey('idle', 1) === 'avatar/idle/frame1.png', 'skiaLoader avatar idle frame key');
assert(getAvatarFrameKey('walk', 3) === 'avatar/walk/frame3.png', 'skiaLoader avatar walk frame key');
assert(getAvatarFrameKey('celebrate', 6) === 'avatar/celebrate/frame6.png', 'skiaLoader avatar celebrate frame key');

// --- 5. Cross-module Consistency ---
console.log('5. Cross-module Consistency');

const biomeTypes = ['wilderness', 'town', 'suburbs', 'city'];
for (const b of biomeTypes) {
  assert(b in BIOME_PALETTES, `${b} in BIOME_PALETTES`);
}

// Daily layout task categories match valid TaskCategory values
const validCategories = ['medication', 'nutrition', 'movement', 'wellness', 'checkin'];
for (const task of daily) {
  assert(validCategories.includes(task.category!), `${task.id} has valid category ${task.category}`);
}

// QUARTER_BIOMES values are valid biome keys
for (const q of [1, 2, 3, 4] as const) {
  assert(biomeTypes.includes(QUARTER_BIOMES[q]), `QUARTER_BIOMES[${q}] is valid biome`);
}

// All path node IDs are unique within their config
for (const [key, config] of Object.entries(PATH_CONFIGS)) {
  const monthlyIds = config.monthlyPath.map((n) => n.id);
  const uniqueMonthly = new Set(monthlyIds);
  assert(uniqueMonthly.size === monthlyIds.length, `${key} monthly node IDs are unique`);

  for (const [weekId, days] of Object.entries(config.weeklyPaths)) {
    const dayIds = days.map((n) => n.id);
    const uniqueDays = new Set(dayIds);
    assert(uniqueDays.size === dayIds.length, `${key} ${weekId} day node IDs are unique`);
  }
}

// Daily layout node IDs are unique
const dailyIds = daily.map((n) => n.id);
const uniqueDaily = new Set(dailyIds);
assert(uniqueDaily.size === dailyIds.length, 'daily layout node IDs are unique');

// --- 6. Seasonal Palette System ---
console.log('6. Seasonal Palette System');

const allSeasons = ['spring', 'summer', 'fall', 'winter'] as const;
const allBiomes = ['wilderness', 'town', 'suburbs', 'city'] as const;

for (const season of allSeasons) {
  assert(season in SEASON_TINTS, `${season} tint exists`);
  const tint = SEASON_TINTS[season];
  assert(typeof tint.r === 'number', `${season} tint.r is number`);
  assert(typeof tint.g === 'number', `${season} tint.g is number`);
  assert(typeof tint.b === 'number', `${season} tint.b is number`);
}

// All 16 biome/season combos produce valid hex numbers
for (const biome of allBiomes) {
  for (const season of allSeasons) {
    const p = getSeasonalPalette(biome, season);
    assert(typeof p.ground === 'number' && p.ground >= 0 && p.ground <= 0xffffff, `${biome}/${season} ground valid`);
    assert(typeof p.path === 'number' && p.path >= 0 && p.path <= 0xffffff, `${biome}/${season} path valid`);
    assert(typeof p.water === 'number' && p.water >= 0 && p.water <= 0xffffff, `${biome}/${season} water valid`);
    assert(typeof p.accent === 'number' && p.accent >= 0 && p.accent <= 0xffffff, `${biome}/${season} accent valid`);
  }
}

// Seasonal tinting produces different values than base palette
for (const biome of allBiomes) {
  const base = BIOME_PALETTES[biome];
  let anyDifferent = false;
  for (const season of allSeasons) {
    const tinted = getSeasonalPalette(biome, season);
    if (tinted.ground !== base.ground || tinted.path !== base.path) {
      anyDifferent = true;
    }
  }
  assert(anyDifferent, `${biome} has at least one season that differs from base`);
}

// Spring differs from winter for same biome
const wSpring = getSeasonalPalette('wilderness', 'spring');
const wWinter = getSeasonalPalette('wilderness', 'winter');
assert(wSpring.ground !== wWinter.ground, 'wilderness spring/winter ground differ');
assert(wSpring.water !== wWinter.water, 'wilderness spring/winter water differ');

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
