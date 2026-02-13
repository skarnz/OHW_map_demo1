import { Graphics, Container } from 'pixi.js';

// Object pool for Pixi Graphics to avoid GC pressure during scene rebuilds.
// rebuildScene() is called on every nodeStates change; without pooling, each
// rebuild creates dozens of Graphics objects that get immediately destroyed.

const pool: Graphics[] = [];
const MAX_POOL_SIZE = 200;

export function acquireGraphics(label?: string): Graphics {
  const g = pool.pop() || new Graphics();
  g.clear();
  g.alpha = 1;
  g.visible = true;
  g.x = 0;
  g.y = 0;
  g.scale.set(1);
  g.rotation = 0;
  g.zIndex = 0;
  g.eventMode = 'auto';
  g.cursor = 'default';
  if (label) g.label = label;
  return g;
}

export function releaseGraphics(g: Graphics) {
  if (pool.length >= MAX_POOL_SIZE) {
    g.destroy();
    return;
  }
  g.clear();
  g.removeAllListeners();
  if (g.parent) g.parent.removeChild(g);
  pool.push(g);
}

export function releaseContainerChildren(container: Container, keepSet?: Set<Container | null | undefined>) {
  const children = [...container.children];
  for (const child of children) {
    if (keepSet?.has(child as Container)) continue;
    if (child instanceof Graphics) {
      releaseGraphics(child);
    } else if (child instanceof Container) {
      // Recursively release Graphics in sub-containers, then destroy the container
      releaseContainerChildren(child);
      container.removeChild(child);
      child.destroy({ children: true });
    }
  }
}

export function getPoolStats(): { pooled: number; maxSize: number } {
  return { pooled: pool.length, maxSize: MAX_POOL_SIZE };
}
