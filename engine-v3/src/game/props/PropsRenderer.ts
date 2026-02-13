import { Container, Graphics } from 'pixi.js';
import { Biome, Season, PathNode } from '../contracts';
import { getSeasonalPalette } from '../../theme/tokens';

interface PropPlacement {
  x: number;
  y: number;
  type: PropType;
  scale: number;
}

type PropType = 'tree' | 'bush' | 'rock' | 'flower' | 'building' | 'pond' | 'bench' | 'lamp';

// Procedural prop generation along paths to fill the environment
// Will be replaced with sprite-based props in Phase 4 polish pass
const BIOME_PROPS: Record<Biome, PropType[]> = {
  wilderness: ['tree', 'bush', 'rock', 'flower', 'pond'],
  town: ['tree', 'bush', 'bench', 'lamp', 'flower'],
  suburbs: ['tree', 'bush', 'building', 'bench', 'flower'],
  city: ['building', 'lamp', 'bench', 'tree', 'bush'],
};

export function generateProps(
  pathNodes: PathNode[],
  biome: Biome,
  seed: number = 42,
): PropPlacement[] {
  const props: PropPlacement[] = [];
  const availableTypes = BIOME_PROPS[biome];
  let rng = seed;

  function random() {
    rng = (rng * 16807 + 0) % 2147483647;
    return (rng & 0x7fffffff) / 0x7fffffff;
  }

  for (let i = 0; i < pathNodes.length - 1; i++) {
    const a = pathNodes[i];
    const b = pathNodes[i + 1];

    // Place 2-4 props per segment on either side of path
    const count = 2 + Math.floor(random() * 3);
    for (let j = 0; j < count; j++) {
      const t = 0.15 + random() * 0.7;
      const px = a.x + (b.x - a.x) * t;
      const py = a.y + (b.y - a.y) * t;
      const side = random() > 0.5 ? 1 : -1;
      const offset = 50 + random() * 60;
      const propType = availableTypes[Math.floor(random() * availableTypes.length)];

      props.push({
        x: px + side * offset,
        y: py + (random() - 0.5) * 30,
        type: propType,
        scale: 0.6 + random() * 0.5,
      });
    }
  }

  // Add extra scatter around start and end
  for (let i = 0; i < 4; i++) {
    const node = i < 2 ? pathNodes[0] : pathNodes[pathNodes.length - 1];
    if (!node) continue;
    props.push({
      x: node.x + (random() - 0.5) * 160,
      y: node.y + (random() - 0.5) * 100,
      type: availableTypes[Math.floor(random() * availableTypes.length)],
      scale: 0.5 + random() * 0.6,
    });
  }

  return props;
}

export function renderProps(
  container: Container,
  props: PropPlacement[],
  biome: Biome,
  season: Season = 'spring',
) {
  const palette = getSeasonalPalette(biome, season);

  for (const prop of props) {
    const g = new Graphics();
    g.label = `prop-${prop.type}`;

    switch (prop.type) {
      case 'tree':
        drawTree(g, palette.accent, prop.scale);
        break;
      case 'bush':
        drawBush(g, palette.ground, prop.scale);
        break;
      case 'rock':
        drawRock(g, prop.scale);
        break;
      case 'flower':
        drawFlower(g, prop.scale);
        break;
      case 'building':
        drawBuilding(g, palette.accent, prop.scale);
        break;
      case 'pond':
        drawPond(g, palette.water, prop.scale);
        break;
      case 'bench':
        drawBench(g, prop.scale);
        break;
      case 'lamp':
        drawLamp(g, prop.scale);
        break;
    }

    g.x = prop.x;
    g.y = prop.y;
    g.alpha = 0.6;
    container.addChild(g);
  }
}

function drawTree(g: Graphics, accent: number, scale: number) {
  const s = scale;
  // Trunk
  g.roundRect(-3 * s, -2 * s, 6 * s, 14 * s, 1);
  g.fill({ color: 0x8B6914 });
  // Canopy
  g.circle(0, -10 * s, 12 * s);
  g.fill({ color: accent, alpha: 0.8 });
  g.circle(-4 * s, -6 * s, 8 * s);
  g.fill({ color: accent, alpha: 0.6 });
}

function drawBush(g: Graphics, ground: number, scale: number) {
  const s = scale;
  g.ellipse(0, 0, 10 * s, 7 * s);
  g.fill({ color: ground, alpha: 0.7 });
  g.ellipse(-3 * s, -2 * s, 7 * s, 5 * s);
  g.fill({ color: ground, alpha: 0.5 });
}

function drawRock(g: Graphics, scale: number) {
  const s = scale;
  g.ellipse(0, 2 * s, 8 * s, 5 * s);
  g.fill({ color: 0x999999 });
  g.ellipse(-2 * s, 0, 6 * s, 4 * s);
  g.fill({ color: 0xAAAAAA });
}

function drawFlower(g: Graphics, scale: number) {
  const s = scale;
  const colors = [0xFF69B4, 0xFFD700, 0xFF6347, 0x9370DB, 0xFF8C00];
  const color = colors[Math.floor(Math.abs(s * 100) % colors.length)];
  // Stem
  g.rect(-1, 0, 2, 8 * s);
  g.fill({ color: 0x228B22 });
  // Petals
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5;
    g.circle(Math.cos(angle) * 3 * s, Math.sin(angle) * 3 * s - 2 * s, 2.5 * s);
    g.fill({ color });
  }
  // Center
  g.circle(0, -2 * s, 2 * s);
  g.fill({ color: 0xFFD700 });
}

function drawBuilding(g: Graphics, accent: number, scale: number) {
  const s = scale;
  g.roundRect(-8 * s, -16 * s, 16 * s, 20 * s, 2);
  g.fill({ color: accent, alpha: 0.5 });
  // Windows
  g.rect(-4 * s, -12 * s, 3 * s, 3 * s);
  g.fill({ color: 0xFFFF99, alpha: 0.6 });
  g.rect(1 * s, -12 * s, 3 * s, 3 * s);
  g.fill({ color: 0xFFFF99, alpha: 0.6 });
  // Door
  g.roundRect(-2 * s, -2 * s, 4 * s, 6 * s, 1);
  g.fill({ color: 0x8B4513, alpha: 0.6 });
}

function drawPond(g: Graphics, water: number, scale: number) {
  const s = scale;
  g.ellipse(0, 0, 14 * s, 8 * s);
  g.fill({ color: water, alpha: 0.4 });
  g.ellipse(-2 * s, -1 * s, 10 * s, 6 * s);
  g.fill({ color: water, alpha: 0.3 });
}

function drawBench(g: Graphics, scale: number) {
  const s = scale;
  // Seat
  g.roundRect(-8 * s, -2 * s, 16 * s, 4 * s, 1);
  g.fill({ color: 0x8B6914 });
  // Legs
  g.rect(-6 * s, 2 * s, 2 * s, 4 * s);
  g.fill({ color: 0x666666 });
  g.rect(4 * s, 2 * s, 2 * s, 4 * s);
  g.fill({ color: 0x666666 });
}

function drawLamp(g: Graphics, scale: number) {
  const s = scale;
  // Pole
  g.rect(-1 * s, -14 * s, 2 * s, 18 * s);
  g.fill({ color: 0x555555 });
  // Light
  g.circle(0, -16 * s, 4 * s);
  g.fill({ color: 0xFFE4B5, alpha: 0.7 });
  g.circle(0, -16 * s, 6 * s);
  g.fill({ color: 0xFFE4B5, alpha: 0.2 });
}
