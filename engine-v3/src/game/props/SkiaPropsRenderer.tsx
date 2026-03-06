import React, { useMemo } from 'react';
import { Circle, Group, Oval, Rect, RoundedRect } from '@shopify/react-native-skia';
import { Biome, PathNode, Season } from '../contracts';
import { getSeasonalPalette } from '../../theme/tokens';

type PropType = 'tree' | 'bush' | 'rock' | 'flower' | 'building' | 'pond' | 'bench' | 'lamp';

interface PropPlacement {
  x: number;
  y: number;
  type: PropType;
  scale: number;
}

const BIOME_PROPS: Record<Biome, PropType[]> = {
  wilderness: ['tree', 'bush', 'rock', 'flower', 'pond'],
  town: ['tree', 'bush', 'bench', 'lamp', 'flower'],
  suburbs: ['tree', 'bush', 'building', 'bench', 'flower'],
  city: ['building', 'lamp', 'bench', 'tree', 'bush'],
};

function generateProps(
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

function toHex(n: number): string {
  return `#${n.toString(16).padStart(6, '0')}`;
}

function toHexAlpha(n: number, alpha: number): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `#${n.toString(16).padStart(6, '0')}${a}`;
}

interface SkiaPropsRendererProps {
  pathNodes: PathNode[];
  biome: Biome;
  season: Season;
  screenWidth: number;
}

export default function SkiaPropsRenderer({
  pathNodes,
  biome,
  season,
  screenWidth,
}: SkiaPropsRendererProps) {
  const palette = useMemo(
    () => getSeasonalPalette(biome, season),
    [biome, season],
  );

  const resolvedNodes = useMemo(() => {
    return pathNodes.map((node) => ({
      ...node,
      x: node.x <= 1.0 ? node.x * screenWidth : node.x,
    }));
  }, [pathNodes, screenWidth]);

  const props = useMemo(
    () => generateProps(resolvedNodes, biome),
    [resolvedNodes, biome],
  );

  return (
    <Group opacity={0.6}>
      {props.map((prop, i) => (
        <PropShape key={i} prop={prop} palette={palette} />
      ))}
    </Group>
  );
}

interface PropShapeProps {
  prop: PropPlacement;
  palette: { ground: number; path: number; water: number; accent: number };
}

function PropShape({ prop, palette }: PropShapeProps) {
  switch (prop.type) {
    case 'tree':
      return <SkiaTree x={prop.x} y={prop.y} scale={prop.scale} accent={palette.accent} />;
    case 'bush':
      return <SkiaBush x={prop.x} y={prop.y} scale={prop.scale} ground={palette.ground} />;
    case 'rock':
      return <SkiaRock x={prop.x} y={prop.y} scale={prop.scale} />;
    case 'flower':
      return <SkiaFlower x={prop.x} y={prop.y} scale={prop.scale} />;
    case 'building':
      return <SkiaBuilding x={prop.x} y={prop.y} scale={prop.scale} accent={palette.accent} />;
    case 'pond':
      return <SkiaPond x={prop.x} y={prop.y} scale={prop.scale} water={palette.water} />;
    case 'bench':
      return <SkiaBench x={prop.x} y={prop.y} scale={prop.scale} />;
    case 'lamp':
      return <SkiaLamp x={prop.x} y={prop.y} scale={prop.scale} />;
  }
}

function SkiaTree({ x, y, scale: s, accent }: { x: number; y: number; scale: number; accent: number }) {
  return (
    <Group>
      <RoundedRect
        x={x - 3 * s}
        y={y - 2 * s}
        width={6 * s}
        height={14 * s}
        r={1}
        color="#8B6914"
      />
      <Circle cx={x} cy={y - 10 * s} r={12 * s} color={toHexAlpha(accent, 0.8)} />
      <Circle cx={x - 4 * s} cy={y - 6 * s} r={8 * s} color={toHexAlpha(accent, 0.6)} />
    </Group>
  );
}

function SkiaBush({ x, y, scale: s, ground }: { x: number; y: number; scale: number; ground: number }) {
  return (
    <Group>
      <Oval x={x - 10 * s} y={y - 7 * s} width={20 * s} height={14 * s} color={toHexAlpha(ground, 0.7)} />
      <Oval x={x - 3 * s - 7 * s} y={y - 2 * s - 5 * s} width={14 * s} height={10 * s} color={toHexAlpha(ground, 0.5)} />
    </Group>
  );
}

function SkiaRock({ x, y, scale: s }: { x: number; y: number; scale: number }) {
  return (
    <Group>
      <Oval x={x - 8 * s} y={y + 2 * s - 5 * s} width={16 * s} height={10 * s} color="#999999" />
      <Oval x={x - 2 * s - 6 * s} y={y - 4 * s} width={12 * s} height={8 * s} color="#AAAAAA" />
    </Group>
  );
}

function SkiaFlower({ x, y, scale: s }: { x: number; y: number; scale: number }) {
  const colors = ['#FF69B4', '#FFD700', '#FF6347', '#9370DB', '#FF8C00'];
  const color = colors[Math.floor(Math.abs(s * 100) % colors.length)];

  return (
    <Group>
      <Rect x={x - 1} y={y} width={2} height={8 * s} color="#228B22" />
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (Math.PI * 2 * i) / 5;
        return (
          <Circle
            key={i}
            cx={x + Math.cos(angle) * 3 * s}
            cy={y + Math.sin(angle) * 3 * s - 2 * s}
            r={2.5 * s}
            color={color}
          />
        );
      })}
      <Circle cx={x} cy={y - 2 * s} r={2 * s} color="#FFD700" />
    </Group>
  );
}

function SkiaBuilding({ x, y, scale: s, accent }: { x: number; y: number; scale: number; accent: number }) {
  return (
    <Group>
      <RoundedRect
        x={x - 8 * s}
        y={y - 16 * s}
        width={16 * s}
        height={20 * s}
        r={2}
        color={toHexAlpha(accent, 0.5)}
      />
      <Rect x={x - 4 * s} y={y - 12 * s} width={3 * s} height={3 * s} color="rgba(255, 255, 153, 0.6)" />
      <Rect x={x + 1 * s} y={y - 12 * s} width={3 * s} height={3 * s} color="rgba(255, 255, 153, 0.6)" />
      <RoundedRect
        x={x - 2 * s}
        y={y - 2 * s}
        width={4 * s}
        height={6 * s}
        r={1}
        color="rgba(139, 69, 19, 0.6)"
      />
    </Group>
  );
}

function SkiaPond({ x, y, scale: s, water }: { x: number; y: number; scale: number; water: number }) {
  return (
    <Group>
      <Oval x={x - 14 * s} y={y - 8 * s} width={28 * s} height={16 * s} color={toHexAlpha(water, 0.4)} />
      <Oval x={x - 2 * s - 10 * s} y={y - 1 * s - 6 * s} width={20 * s} height={12 * s} color={toHexAlpha(water, 0.3)} />
    </Group>
  );
}

function SkiaBench({ x, y, scale: s }: { x: number; y: number; scale: number }) {
  return (
    <Group>
      <RoundedRect
        x={x - 8 * s}
        y={y - 2 * s}
        width={16 * s}
        height={4 * s}
        r={1}
        color="#8B6914"
      />
      <Rect x={x - 6 * s} y={y + 2 * s} width={2 * s} height={4 * s} color="#666666" />
      <Rect x={x + 4 * s} y={y + 2 * s} width={2 * s} height={4 * s} color="#666666" />
    </Group>
  );
}

function SkiaLamp({ x, y, scale: s }: { x: number; y: number; scale: number }) {
  return (
    <Group>
      <Rect x={x - 1 * s} y={y - 14 * s} width={2 * s} height={18 * s} color="#555555" />
      <Circle cx={x} cy={y - 16 * s} r={4 * s} color="rgba(255, 228, 181, 0.7)" />
      <Circle cx={x} cy={y - 16 * s} r={6 * s} color="rgba(255, 228, 181, 0.2)" />
    </Group>
  );
}
