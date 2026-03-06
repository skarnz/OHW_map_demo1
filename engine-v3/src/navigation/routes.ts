// Route configuration: maps task categories and node types to native app deep links.
// The host OHW app exposes these screens via URL scheme `ohw://`.
// On web, routes resolve to relative paths for the web app fallback.

import { TaskCategory, NodeState } from '../game/contracts';

export interface RouteTarget {
  path: string;
  deepLink: string;
  title: string;
}

// Task category -> native screen mapping
export const TASK_ROUTES: Record<TaskCategory, RouteTarget> = {
  medication: {
    path: '/medication-tracker',
    deepLink: 'ohw://medication-tracker',
    title: 'Medication Tracker',
  },
  nutrition: {
    path: '/food-logger',
    deepLink: 'ohw://food-logger',
    title: 'Food Logger',
  },
  movement: {
    path: '/activity-tracker',
    deepLink: 'ohw://activity-tracker',
    title: 'Activity Tracker',
  },
  wellness: {
    path: '/wellness-checkin',
    deepLink: 'ohw://wellness-checkin',
    title: 'Wellness Check-in',
  },
  checkin: {
    path: '/daily-checkin',
    deepLink: 'ohw://daily-checkin',
    title: 'Daily Check-in',
  },
};

// Completed tasks open a review/summary screen instead of the active tracker
export const COMPLETED_ROUTE_SUFFIX = '/review';

export function getRouteForTask(
  category: TaskCategory,
  nodeState: NodeState,
  nodeId: string,
): RouteTarget | null {
  if (nodeState === 'locked') return null;

  const base = TASK_ROUTES[category];
  if (!base) return null;

  if (nodeState === 'completed' || nodeState === 'skipped') {
    return {
      path: `${base.path}${COMPLETED_ROUTE_SUFFIX}`,
      deepLink: `${base.deepLink}${COMPLETED_ROUTE_SUFFIX}`,
      title: `${base.title} (Review)`,
    };
  }

  return {
    ...base,
    deepLink: `${base.deepLink}?nodeId=${encodeURIComponent(nodeId)}`,
  };
}
