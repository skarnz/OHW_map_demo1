/**
 * Smoke test for Pixi.js-dependent modules (headless, no GL context).
 * Tests constructors, method signatures, and logic without rendering.
 * 
 * Run: npx tsx scripts/smoke-test-pixi.ts
 */

import { Graphics, Container, TextStyle, Text as PixiText } from 'pixi.js';
import { AvatarController } from '../src/game/avatar/AvatarController';
import { CelebrationEffect } from '../src/game/effects/CelebrationEffect';
import { generateProps, renderProps } from '../src/game/props/PropsRenderer';
import type { PathNode, Biome } from '../src/game/contracts';

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

console.log('=== Pixi Module Smoke Test ===\n');

// --- AvatarController ---
console.log('1. AvatarController');
const avatar = new AvatarController();
assert(avatar.container instanceof Container, 'avatar container is Container');
assert(avatar.state === 'idle', 'initial state is idle');
assert(avatar.container.label === 'avatar', 'avatar label');
assert(avatar.container.zIndex === 1000, 'avatar zIndex');
assert(avatar.container.children.length >= 1, 'avatar has body group');

avatar.setPosition(100, 200);
assert(avatar.container.x === 100, 'setPosition x');
assert(avatar.container.y === 200, 'setPosition y');

// Walk with no valid path (should immediately arrive)
let arrivedId = '';
const nodes: PathNode[] = [
  { id: 'a', x: 0, y: 0, type: 'day' },
  { id: 'b', x: 100, y: 100, type: 'day' },
  { id: 'c', x: 200, y: 200, type: 'day' },
];
avatar.walkTo(nodes[0], nodes, 'a', (id) => { arrivedId = id; }); // same node
assert(arrivedId === 'a', 'walkTo same node fires immediately');

// Walk to different node
arrivedId = '';
avatar.walkTo(nodes[2], nodes, 'a', (id) => { arrivedId = id; });
assert(avatar.state === 'walking', 'state is walking after walkTo');

// Run a few update cycles
for (let i = 0; i < 500; i++) {
  avatar.update(1);
}
assert(avatar.state === 'idle', 'avatar returned to idle after walk completes');
assert(arrivedId === 'c', 'arrived at target node c');

// Celebrate
let celebDone = false;
avatar.celebrate(() => { celebDone = true; });
assert(avatar.state === 'celebrating', 'state is celebrating');
for (let i = 0; i < 100; i++) {
  avatar.update(1);
}
assert(avatar.state === 'idle', 'avatar back to idle after celebrate');
assert(celebDone, 'celebration callback fired');

avatar.destroy();
console.log('  Avatar: OK');

// --- CelebrationEffect ---
console.log('2. CelebrationEffect');
const celebration = new CelebrationEffect();
assert(celebration.container instanceof Container, 'celebration container');
assert(celebration.container.label === 'celebration', 'celebration label');
assert(celebration.container.zIndex === 2000, 'celebration zIndex');

let effectDone = false;
celebration.play(150, 250, 50, () => { effectDone = true; });
assert(celebration.container.children.length > 0, 'particles spawned');
const particleCount = celebration.container.children.length;
assert(particleCount === 13, `13 children (12 particles + 1 text), got ${particleCount}`);

// Run through effect
for (let i = 0; i < 80; i++) {
  celebration.update();
}
assert(effectDone, 'celebration onComplete fired');

celebration.destroy();
console.log('  Celebration: OK');

// --- PropsRenderer ---
console.log('3. PropsRenderer');
const pathNodes: PathNode[] = [
  { id: 'w1', x: 100, y: 600, type: 'week' },
  { id: 'w2', x: 200, y: 500, type: 'week' },
  { id: 'w3', x: 150, y: 400, type: 'week' },
  { id: 'w4', x: 250, y: 300, type: 'week' },
];

const biomes: Biome[] = ['wilderness', 'town', 'suburbs', 'city'];
for (const biome of biomes) {
  const props = generateProps(pathNodes, biome, 42);
  assert(props.length > 0, `${biome} generates props (${props.length})`);
  assert(props.every(p => typeof p.x === 'number' && typeof p.y === 'number'), `${biome} props have coords`);
  assert(props.every(p => p.scale > 0), `${biome} props have positive scale`);

  // Render them
  const container = new Container();
  renderProps(container, props, biome);
  assert(container.children.length === props.length, `${biome} rendered ${container.children.length} props`);
  container.destroy({ children: true });
}

// Deterministic seeding
const props1 = generateProps(pathNodes, 'wilderness', 42);
const props2 = generateProps(pathNodes, 'wilderness', 42);
assert(props1.length === props2.length, 'same seed = same count');
assert(props1[0].x === props2[0].x && props1[0].y === props2[0].y, 'same seed = same positions');

const props3 = generateProps(pathNodes, 'wilderness', 99);
assert(props3[0].x !== props1[0].x || props3[0].y !== props1[0].y, 'different seed = different positions');

console.log('  Props: OK');

// --- Pixi v8 Graphics API ---
console.log('4. Pixi v8 Graphics API sanity');
const g = new Graphics();

// All methods used in our codebase
g.circle(0, 0, 10);
g.fill({ color: 0xFF0000 });
g.stroke({ width: 2, color: 0x00FF00 });
g.rect(0, 0, 50, 50);
g.fill({ color: 0x0000FF });
g.roundRect(0, 0, 50, 50, 5);
g.fill({ color: 0xFFFF00 });
g.ellipse(0, 0, 20, 10);
g.fill({ color: 0xFF00FF });
g.star(0, 0, 4, 10, 4);
g.fill({ color: 0xFFD700 });
g.moveTo(0, 0);
g.lineTo(100, 100);
g.stroke({ width: 2, color: 0xAAAAAA });
g.moveTo(0, 0);
g.quadraticCurveTo(50, 50, 100, 0);
g.stroke({ width: 3, color: 0xBBBBBB, alpha: 0.5, cap: 'round', join: 'round' });
g.clear();

assert(true, 'all Graphics methods work');

// TextStyle
const style = new TextStyle({
  fontSize: 14,
  fill: '#333',
  fontWeight: 'bold',
  align: 'center',
  stroke: { color: '#FFFFFF', width: 3 },
});
const txt = new PixiText({ text: 'test', style });
txt.anchor.set(0.5);
assert(txt.text === 'test', 'PixiText created');

g.destroy();
txt.destroy();
console.log('  Graphics: OK');

// --- GraphicsPool ---
console.log('5. GraphicsPool');
import { acquireGraphics, releaseGraphics, getPoolStats } from '../src/game/renderer/GraphicsPool';

const g1 = acquireGraphics('test-1');
assert(g1 instanceof Graphics, 'acquireGraphics returns Graphics');
assert(g1.label === 'test-1', 'acquireGraphics sets label');

g1.circle(0, 0, 10);
g1.fill({ color: 0xFF0000 });
releaseGraphics(g1);

const stats1 = getPoolStats();
assert(stats1.pooled === 1, `pool has 1 after release (got ${stats1.pooled})`);

const g2 = acquireGraphics('test-2');
assert(g2 === g1, 'acquireGraphics reuses pooled Graphics');
assert(g2.label === 'test-2', 'reused Graphics has new label');

const stats2 = getPoolStats();
assert(stats2.pooled === 0, `pool is empty after acquire (got ${stats2.pooled})`);

// Pool respects max size
for (let i = 0; i < 210; i++) {
  const gi = acquireGraphics();
  releaseGraphics(gi);
}
const stats3 = getPoolStats();
assert(stats3.pooled <= stats3.maxSize, `pool respects maxSize (${stats3.pooled} <= ${stats3.maxSize})`);

g2.destroy();
console.log('  GraphicsPool: OK');

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
