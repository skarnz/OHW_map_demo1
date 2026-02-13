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

function generateWeeklyPath(weekId: string): PathNode[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mapWidth = 380;
  const mapHeight = 600;
  const margin = 50;
  const usableWidth = mapWidth - margin * 2;
  const yStep = (mapHeight - margin * 2) / (days.length - 1);

  return days.map((day, i) => {
    const isEven = i % 2 === 0;
    const xBase = isEven ? margin + usableWidth * 0.3 : margin + usableWidth * 0.7;
    const xWobble = (Math.sin(i * 1.8) * usableWidth * 0.15);
    return {
      id: `${weekId}-d${i + 1}`,
      x: Math.round(xBase + xWobble),
      y: Math.round(mapHeight - margin - i * yStep),
      type: 'day' as const,
      label: day,
    };
  });
}

function generateMonthlyPath(weekCount: number): PathNode[] {
  const mapWidth = 380;
  const mapHeight = Math.max(600, weekCount * 80 + 100);
  const margin = 60;
  const yStep = (mapHeight - margin * 2) / Math.max(weekCount - 1, 1);

  return Array.from({ length: weekCount }, (_, i) => {
    const isEven = Math.floor(i / 2) % 2 === 0;
    const xBase = isEven
      ? margin + (i % 2) * 120
      : mapWidth - margin - (i % 2) * 120;
    const xWobble = Math.sin(i * 1.2) * 40;

    return {
      id: `w${i + 1}`,
      x: Math.round(Math.max(margin, Math.min(mapWidth - margin, xBase + xWobble))),
      y: Math.round(mapHeight - margin - i * yStep),
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
