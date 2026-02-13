// Scene communication contract between React Native and Pixi.js
// React Native OWNS state, Pixi.js RENDERS state and emits user actions

export type SceneType = 'monthly' | 'weekly' | 'daily';

export type NodeState = 'locked' | 'unlocked' | 'in_progress' | 'completed' | 'skipped';

export type Biome = 'wilderness' | 'town' | 'suburbs' | 'city';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export type TaskCategory = 'medication' | 'nutrition' | 'movement' | 'wellness' | 'checkin';

export interface PathNode {
  id: string;
  x: number;
  y: number;
  type: 'week' | 'day' | 'task';
  label?: string;
  category?: TaskCategory;
}

// React Native → Pixi.js (via props)
export interface GameSceneProps {
  sceneType: SceneType;
  journeyId: string;
  currentQuarter: 1 | 2 | 3 | 4;
  currentWeek: number;
  currentDay: number;
  pathNodes: PathNode[];
  nodeStates: Record<string, NodeState>;
  biome: Biome;
  season: Season;
  avatarPosition: string; // nodeId where avatar currently is
}

// Pixi.js → React Native (via callbacks)
export interface GameSceneCallbacks {
  onNodeTapped: (nodeId: string, nodeType: 'week' | 'day' | 'task') => void;
  onBackPressed: () => void;
  onSceneReady: () => void;
  onAvatarArrived: (nodeId: string) => void;
  onCelebrationComplete: () => void;
}

// Node state machine
export const VALID_TRANSITIONS: Record<NodeState, NodeState[]> = {
  locked: ['unlocked'],
  unlocked: ['in_progress', 'skipped'],
  in_progress: ['completed', 'skipped'],
  completed: [],
  skipped: [],
};

export function canTransition(from: NodeState, to: NodeState): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export function transitionNode(
  current: NodeState,
  target: NodeState,
): NodeState {
  if (canTransition(current, target)) return target;
  return current;
}

export const QUARTER_BIOMES: Record<1 | 2 | 3 | 4, Biome> = {
  1: 'wilderness',
  2: 'town',
  3: 'suburbs',
  4: 'city',
};
