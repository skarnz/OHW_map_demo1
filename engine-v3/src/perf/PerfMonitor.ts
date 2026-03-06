import { Platform } from 'react-native';

export interface PerfSnapshot {
  timestamp: number;
  fps: number;
  avgFrameTime: number;
  maxFrameTime: number;
  minFrameTime: number;
  p95FrameTime: number;
  p99FrameTime: number;
  droppedFrames: number;
  jsHeapMB: number | null;
  sampleCount: number;
}

export interface PerfReport {
  device: string;
  platform: string;
  scene: string;
  nodeCount: number;
  propCount: number;
  duration: number;
  snapshots: PerfSnapshot[];
  summary: PerfSnapshot;
}

const TARGET_FPS = 60;
const TARGET_FRAME_MS = 1000 / TARGET_FPS;
const SNAPSHOT_INTERVAL_MS = 1000;

class PerfMonitor {
  private frameTimes: number[] = [];
  private lastFrameTime = 0;
  private snapshots: PerfSnapshot[] = [];
  private snapshotTimer: ReturnType<typeof setInterval> | null = null;
  private startTime = 0;
  private _enabled = false;
  private _scene = '';
  private _nodeCount = 0;
  private _propCount = 0;
  private onSnapshot: ((snap: PerfSnapshot) => void) | null = null;

  start(scene: string, nodeCount: number, propCount: number, cb?: (snap: PerfSnapshot) => void) {
    this._enabled = true;
    this._scene = scene;
    this._nodeCount = nodeCount;
    this._propCount = propCount;
    this.onSnapshot = cb ?? null;
    this.frameTimes = [];
    this.snapshots = [];
    this.lastFrameTime = 0;
    this.startTime = Date.now();

    this.snapshotTimer = setInterval(() => {
      const snap = this.takeSnapshot();
      if (snap) {
        this.snapshots.push(snap);
        this.onSnapshot?.(snap);
      }
    }, SNAPSHOT_INTERVAL_MS);
  }

  stop(): PerfReport | null {
    this._enabled = false;
    if (this.snapshotTimer) {
      clearInterval(this.snapshotTimer);
      this.snapshotTimer = null;
    }
    if (!this.snapshots.length) return null;

    return {
      device: Platform.OS === 'ios' ? 'iOS Simulator' : Platform.OS === 'android' ? 'Android Emulator' : 'Web',
      platform: `${Platform.OS} (${Platform.Version ?? 'unknown'})`,
      scene: this._scene,
      nodeCount: this._nodeCount,
      propCount: this._propCount,
      duration: Date.now() - this.startTime,
      snapshots: [...this.snapshots],
      summary: this.computeSummary(),
    };
  }

  recordFrame(now: number) {
    if (!this._enabled) return;
    if (this.lastFrameTime > 0) {
      const dt = now - this.lastFrameTime;
      this.frameTimes.push(dt);
    }
    this.lastFrameTime = now;
  }

  get enabled() {
    return this._enabled;
  }

  private takeSnapshot(): PerfSnapshot | null {
    if (!this.frameTimes.length) return null;

    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const avg = sum / count;
    const dropped = sorted.filter((t) => t > TARGET_FRAME_MS * 1.5).length;

    const snap: PerfSnapshot = {
      timestamp: Date.now(),
      fps: Math.round(1000 / avg),
      avgFrameTime: round2(avg),
      maxFrameTime: round2(sorted[count - 1]),
      minFrameTime: round2(sorted[0]),
      p95FrameTime: round2(sorted[Math.floor(count * 0.95)]),
      p99FrameTime: round2(sorted[Math.floor(count * 0.99)]),
      droppedFrames: dropped,
      jsHeapMB: getJSHeapMB(),
      sampleCount: count,
    };

    this.frameTimes = [];
    return snap;
  }

  private computeSummary(): PerfSnapshot {
    if (!this.snapshots.length) {
      return emptySnapshot();
    }

    const allFps = this.snapshots.map((s) => s.fps);
    const allAvg = this.snapshots.map((s) => s.avgFrameTime);
    const allMax = this.snapshots.map((s) => s.maxFrameTime);
    const allP95 = this.snapshots.map((s) => s.p95FrameTime);
    const allP99 = this.snapshots.map((s) => s.p99FrameTime);
    const allDropped = this.snapshots.map((s) => s.droppedFrames);
    const allHeap = this.snapshots.map((s) => s.jsHeapMB).filter((v): v is number => v !== null);

    return {
      timestamp: Date.now(),
      fps: Math.round(avg(allFps)),
      avgFrameTime: round2(avg(allAvg)),
      maxFrameTime: round2(Math.max(...allMax)),
      minFrameTime: round2(Math.min(...this.snapshots.map((s) => s.minFrameTime))),
      p95FrameTime: round2(avg(allP95)),
      p99FrameTime: round2(avg(allP99)),
      droppedFrames: allDropped.reduce((a, b) => a + b, 0),
      jsHeapMB: allHeap.length ? round2(avg(allHeap)) : null,
      sampleCount: this.snapshots.reduce((a, s) => a + s.sampleCount, 0),
    };
  }
}

function getJSHeapMB(): number | null {
  if (typeof performance !== 'undefined' && (performance as unknown as Record<string, unknown>).memory) {
    const mem = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
    return round2(mem.usedJSHeapSize / (1024 * 1024));
  }
  return null;
}

function avg(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function emptySnapshot(): PerfSnapshot {
  return {
    timestamp: 0,
    fps: 0,
    avgFrameTime: 0,
    maxFrameTime: 0,
    minFrameTime: 0,
    p95FrameTime: 0,
    p99FrameTime: 0,
    droppedFrames: 0,
    jsHeapMB: null,
    sampleCount: 0,
  };
}

export const perfMonitor = new PerfMonitor();
