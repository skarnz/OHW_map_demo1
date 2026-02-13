import { PathNode } from '../game/contracts';

export interface PathConfig {
  id: string;
  name: string;
  weekCount: number;
  monthlyPath: PathNode[];
  weeklyPaths: Record<string, PathNode[]>;
  dailyLayout: PathNode[];
}

const DAILY_LAYOUT: PathNode[] = [
  { id: 'medication', x: 200, y: 120, type: 'task', label: 'Medication', category: 'medication' },
  { id: 'nutrition', x: 320, y: 220, type: 'task', label: 'Nutrition', category: 'nutrition' },
  { id: 'movement', x: 200, y: 340, type: 'task', label: 'Movement', category: 'movement' },
  { id: 'wellness', x: 80, y: 220, type: 'task', label: 'Wellness', category: 'wellness' },
  { id: 'checkin', x: 200, y: 220, type: 'task', label: 'Check-in', category: 'checkin' },
];

// Path coordinates use normalized X (0..1) so the renderer can scale to
// any screen width. Y coordinates are absolute world-space pixels with
// generous spacing (~240pt) so 3-4 nodes fill a phone screen vertically.
// The renderer multiplies normalizedX * viewportWidth at draw time.

function generateWeeklyPath(weekId: string): PathNode[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const nodeSpacing = 160;
  const marginY = 100;
  const mapHeight = days.length * nodeSpacing + marginY * 2;

  return days.map((day, i) => {
    // Zigzag between ~25% and ~75% of viewport width (normalized)
    const nx = i % 2 === 0 ? 0.25 : 0.75;
    return {
      id: `${weekId}-d${i + 1}`,
      x: nx + Math.sin(i * 1.3) * 0.04,
      y: Math.round(mapHeight - marginY - i * nodeSpacing),
      type: 'day' as const,
      label: day,
    };
  });
}

function generateMonthlyPath(weekCount: number): PathNode[] {
  const nodeSpacing = 240;
  const marginY = 160;
  const mapHeight = weekCount * nodeSpacing + marginY * 2;

  return Array.from({ length: weekCount }, (_, i) => {
    // 3-column snake: left(0.2), center(0.5), right(0.8)
    const col = i % 3;
    let nx: number;
    if (col === 0) nx = 0.2;
    else if (col === 1) nx = 0.5;
    else nx = 0.8;

    // Subtle wobble
    nx += Math.sin(i * 0.7) * 0.05;
    nx = Math.max(0.12, Math.min(0.88, nx));

    return {
      id: `w${i + 1}`,
      x: nx,
      y: Math.round(mapHeight - marginY - i * nodeSpacing),
      type: 'week' as const,
      label: `Week ${i + 1}`,
    };
  });
}

function buildPathConfig(id: string, name: string, weekCount: number): PathConfig {
  const monthlyPath = generateMonthlyPath(weekCount);
  const weeklyPaths: Record<string, PathNode[]> = {};

  for (let i = 0; i < weekCount; i++) {
    weeklyPaths[`w${i + 1}`] = generateWeeklyPath(`w${i + 1}`);
  }

  return { id, name, weekCount, monthlyPath, weeklyPaths, dailyLayout: DAILY_LAYOUT };
}

export const PATH_CONFIGS: Record<string, PathConfig> = {
  '4-week': buildPathConfig('4-week', 'Quick Start', 4),
  '8-week': buildPathConfig('8-week', 'Short Journey', 8),
  '12-week': buildPathConfig('12-week', 'Standard Quarter', 12),
  '24-week': buildPathConfig('24-week', 'Extended Journey', 24),
};

export function getPathConfig(weekCount: number): PathConfig {
  const key = `${weekCount}-week`;
  if (PATH_CONFIGS[key]) return PATH_CONFIGS[key];
  return buildPathConfig(key, `${weekCount}-Week Journey`, weekCount);
}
