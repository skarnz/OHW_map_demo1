import './pixiNativeSetup';
import React, { useCallback, useRef, useEffect, useState, MutableRefObject } from 'react';
import { View, StyleSheet, LayoutChangeEvent, Platform } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import {
  Application,
  Container,
  Text as PixiText,
  TextStyle,
  DOMAdapter,
} from 'pixi.js';
import { createMockCanvas } from './pixiAdapter';
import { acquireGraphics, releaseContainerChildren } from './GraphicsPool';
import { GameSceneProps, GameSceneCallbacks, NodeState, PathNode } from '../contracts';
import { getSeasonalPalette } from '../../theme/tokens';
import { AvatarController } from '../avatar/AvatarController';
import { CelebrationEffect } from '../effects/CelebrationEffect';
import { generateProps, renderProps } from '../props/PropsRenderer';
import { SoundManager } from '../audio/SoundManager';

const NODE_RADIUS = 22;

const NODE_COLORS: Record<NodeState, number> = {
  locked: 0xD1D1D1,
  unlocked: 0xFFFFFF,
  in_progress: 0xFFB200,
  completed: 0x34C759,
  skipped: 0xA0A0A0,
};

const NODE_BORDERS: Record<NodeState, number> = {
  locked: 0x999999,
  unlocked: 0x0A84FF,
  in_progress: 0xFF8C00,
  completed: 0x228B22,
  skipped: 0x808080,
};

interface PixiCanvasProps {
  sceneProps: GameSceneProps;
  callbacks: GameSceneCallbacks;
}

export default function PixiCanvas({ sceneProps, callbacks }: PixiCanvasProps) {
  const appRef = useRef<Application | null>(null);
  const worldRef = useRef<Container | null>(null);
  const avatarRef = useRef<AvatarController | null>(null);
  const celebrationRef = useRef<CelebrationEffect | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const cameraRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const dragRef = useRef({ active: false, lx: 0, ly: 0 });
  const boundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const avatarNodeRef = useRef<string>('');

  const propsRef = useRef(sceneProps);
  const callbacksRef = useRef(callbacks);
  propsRef.current = sceneProps;
  callbacksRef.current = callbacks;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
    }
  }, []);

  const onContextCreate = useCallback(async (gl: ExpoWebGLRenderingContext) => {
    if (dimensions.width === 0) return;

    const mockCanvas = createMockCanvas(gl, dimensions.width, dimensions.height);

    // On native, override Pixi's DOMAdapter so internal createCanvas()
    // calls return mock objects instead of touching the DOM.
    // The pixiNativeSetup shim handles document/window/globalThis polyfills,
    // but DOMAdapter.createCanvas needs to return objects with working
    // getContext('2d') for text measurement and getContext('webgl') for rendering.
    if (Platform.OS !== 'web') {
      DOMAdapter.set({
        createCanvas: (w?: number, h?: number) => {
          // Use the document.createElement shim which provides getContext('2d')
          const el = (globalThis as Record<string, unknown>).document as Record<string, (...args: unknown[]) => unknown>;
          const c = el.createElement('canvas') as Record<string, unknown>;
          c.width = w ?? dimensions.width;
          c.height = h ?? dimensions.height;
          // Override WebGL context to return the expo-gl context
          const origGetContext = c.getContext as (type: string) => unknown;
          c.getContext = (type: string) => {
            if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') {
              return gl as unknown;
            }
            return origGetContext(type);
          };
          return c as unknown as HTMLCanvasElement;
        },
        createImage: () => ({
          src: '',
          width: 0,
          height: 0,
          onload: null,
          onerror: null,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as HTMLImageElement,
        getCanvasRenderingContext2D: () => ({ prototype: {} } as unknown as { prototype: CanvasRenderingContext2D }),
        getWebGLRenderingContext: () => WebGLRenderingContext,
        getNavigator: () => ({ userAgent: 'ReactNative', gpu: null }),
        getBaseUrl: () => '',
        getFontFaceSet: () => null,
        fetch: (url: RequestInfo, options?: RequestInit) => fetch(url, options),
        parseXML: () => ({} as unknown as Document),
      });
    }

    const app = new Application();

    try {
      await app.init({
        canvas: mockCanvas as unknown as HTMLCanvasElement,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: getSeasonalPalette(propsRef.current.biome, propsRef.current.season).ground,
        antialias: true,
        resolution: 1,
        preference: 'webgl',
        autoDensity: false,
        resizeTo: undefined,
      });
    } catch (err) {
      console.warn('Pixi init failed:', err);
      if (err instanceof Error) console.warn('Stack:', err.stack);
      try {
        await app.init({
          canvas: mockCanvas as unknown as HTMLCanvasElement,
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: getSeasonalPalette(propsRef.current.biome, propsRef.current.season).ground,
          preference: 'webgl',
          autoDensity: false,
          resizeTo: undefined,
        });
      } catch (err2) {
        console.error('Pixi init failed completely:', err2);
        if (err2 instanceof Error) console.error('Stack:', err2.stack);
        return;
      }
    }

    appRef.current = app;

    const world = new Container();
    world.label = 'world';
    world.sortableChildren = true;
    app.stage.addChild(world);
    worldRef.current = world;

    // Init avatar for weekly/daily scenes
    const showAvatar = propsRef.current.sceneType === 'weekly' || propsRef.current.sceneType === 'daily';
    if (showAvatar) {
      const avatar = new AvatarController();
      avatarRef.current = avatar;
      world.addChild(avatar.container);

      const avatarNode = propsRef.current.pathNodes.find(
        n => n.id === propsRef.current.avatarPosition,
      );
      if (avatarNode) {
        avatar.setPosition(avatarNode.x, avatarNode.y - 38);
        avatarNodeRef.current = avatarNode.id;
      }
    }

    // Init celebration effect
    const celebration = new CelebrationEffect();
    celebrationRef.current = celebration;
    world.addChild(celebration.container);

    // Init sound
    SoundManager.shared().init();

    // Build scene
    rebuildScene(world, propsRef.current, callbacksRef.current, dimensions);

    // Center camera on avatar position
    centerCameraOnNode(propsRef.current.avatarPosition, propsRef.current.pathNodes, dimensions, boundsRef);

    // Render loop
    app.ticker.add((ticker) => {
      const cam = cameraRef.current;
      cam.x += (cam.tx - cam.x) * 0.12;
      cam.y += (cam.ty - cam.y) * 0.12;
      world.x = -cam.x;
      world.y = -cam.y;

      // Update avatar
      if (avatarRef.current) {
        avatarRef.current.update(ticker.deltaTime);

        // Camera follows avatar during walk
        if (avatarRef.current.state === 'walking') {
          const { tx, ty } = clampCameraTarget(
            avatarRef.current.container.x - dimensions.width / 2,
            avatarRef.current.container.y - dimensions.height / 2,
            dimensions,
            boundsRef,
          );
          cameraRef.current.tx = tx;
          cameraRef.current.ty = ty;
        }
      }

      // Update celebration
      if (celebrationRef.current) {
        celebrationRef.current.update();
      }

      gl.endFrameEXP();
    });

    callbacksRef.current.onSceneReady();
  }, [dimensions.width, dimensions.height]);

  // Rebuild when nodeStates or pathNodes change (but not avatar - avatar animates smoothly)
  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;

    // Release poolable Graphics; keep avatar and celebration containers
    const avatar = avatarRef.current?.container;
    const celebration = celebrationRef.current?.container;
    const toKeep = new Set([avatar, celebration].filter(Boolean));
    releaseContainerChildren(world, toKeep);

    rebuildScene(world, sceneProps, callbacks, dimensions);
  }, [sceneProps.nodeStates, sceneProps.pathNodes, dimensions.width, dimensions.height]);

  function centerCameraOnNode(
    nodeId: string,
    nodes: PathNode[],
    dims: { width: number; height: number },
    bounds: MutableRefObject<{ minX: number; maxX: number; minY: number; maxY: number }>,
  ) {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const { tx, ty } = clampCameraTarget(node.x - dims.width / 2, node.y - dims.height / 2, dims, bounds);
      cameraRef.current.x = tx;
      cameraRef.current.y = ty;
      cameraRef.current.tx = tx;
      cameraRef.current.ty = ty;
    }
  }

  function handleNodeTap(
    node: PathNode,
    props: GameSceneProps,
    cbs: GameSceneCallbacks,
    dims: { width: number; height: number },
  ) {
    SoundManager.shared().play('tap');

    const showAvatar = props.sceneType === 'weekly' || props.sceneType === 'daily';
    const avatar = avatarRef.current;

    if (showAvatar && avatar && avatar.state !== 'walking') {
      // Avatar walks to the tapped node, then fires callback
      avatar.walkTo(node, props.pathNodes, avatarNodeRef.current, (arrivedId) => {
        avatarNodeRef.current = arrivedId;
        SoundManager.shared().play('tap');
        cbs.onAvatarArrived(arrivedId);
        cbs.onNodeTapped(arrivedId, node.type);
      });
      SoundManager.shared().play('walk');
    } else {
      // Monthly view or no avatar - immediate callback
      const { tx, ty } = clampCameraTarget(node.x - dims.width / 2, node.y - dims.height / 2, dims, boundsRef);
      cameraRef.current.tx = tx;
      cameraRef.current.ty = ty;
      cbs.onNodeTapped(node.id, node.type);
    }
  }

  function playCelebration(x: number, y: number, points: number) {
    SoundManager.shared().play('celebrate');
    celebrationRef.current?.play(x, y, points, () => {
      callbacksRef.current.onCelebrationComplete();
    });
  }

  // Expose celebration trigger via effect on completed state changes
  const prevStatesRef = useRef<Record<string, NodeState>>({});
  useEffect(() => {
    const prev = prevStatesRef.current;
    const curr = sceneProps.nodeStates;

    for (const [id, state] of Object.entries(curr)) {
      if (state === 'completed' && prev[id] && prev[id] !== 'completed') {
        const node = sceneProps.pathNodes.find(n => n.id === id);
        if (node) {
          avatarRef.current?.celebrate();
          playCelebration(node.x, node.y - 40, 50);
        }
      }
    }
    prevStatesRef.current = { ...curr };
  }, [sceneProps.nodeStates]);

  function rebuildScene(
    world: Container,
    props: GameSceneProps,
    cbs: GameSceneCallbacks,
    dims: { width: number; height: number },
  ) {
    const palette = getSeasonalPalette(props.biome, props.season);
    updateBounds(props.pathNodes, dims, boundsRef);

    // Background
    const bg = acquireGraphics('background');
    bg.zIndex = -100;
    const minX = -200;
    const maxX = 600;
    const minY = -200;
    const maxY = Math.max(900, ...props.pathNodes.map(n => n.y)) + 300;
    bg.rect(minX, minY, maxX - minX, maxY - minY);
    bg.fill({ color: palette.ground, alpha: 0.15 });
    world.addChild(bg);

    // Decorative props (behind paths/nodes)
    const propPlacements = generateProps(props.pathNodes, props.biome, hashString(props.journeyId));
    const propsContainer = new Container();
    propsContainer.label = 'props';
    propsContainer.zIndex = -10;
    renderProps(propsContainer, propPlacements, props.biome, props.season);
    world.addChild(propsContainer);

    // Paths
    drawPaths(world, props.pathNodes, props.nodeStates, palette.path);

    // Nodes
    props.pathNodes.forEach((node) => {
      const state = props.nodeStates[node.id] || 'locked';
      const nc = buildNode(node, state, () => {
        handleNodeTap(node, props, cbs, dims);
      });
      nc.zIndex = 10;
      world.addChild(nc);
    });

    // Monthly avatar indicator dot
    if (props.sceneType === 'monthly') {
      const avatarNode = props.pathNodes.find(n => n.id === props.avatarPosition);
      if (avatarNode) {
        const dot = acquireGraphics('avatar-dot');
        dot.zIndex = 20;
        dot.circle(avatarNode.x, avatarNode.y - NODE_RADIUS - 10, 5);
        dot.fill({ color: 0x0A84FF });
        dot.stroke({ width: 1.5, color: 0xFFFFFF });
        world.addChild(dot);
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      avatarRef.current?.destroy();
      celebrationRef.current?.destroy();
      appRef.current?.destroy(true);
    };
  }, []);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {dimensions.width > 0 && (
        <GLView
          key={`gl-${dimensions.width}-${dimensions.height}`}
          style={styles.canvas}
          onContextCreate={onContextCreate}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(e) => {
            dragRef.current = { active: true, lx: e.nativeEvent.pageX, ly: e.nativeEvent.pageY };
          }}
          onResponderMove={(e) => {
            if (!dragRef.current.active) return;
            const dx = e.nativeEvent.pageX - dragRef.current.lx;
            const dy = e.nativeEvent.pageY - dragRef.current.ly;
            const nextTx = cameraRef.current.tx - dx;
            const nextTy = cameraRef.current.ty - dy;
            const { tx, ty } = clampCameraTarget(nextTx, nextTy, dimensions, boundsRef);
            cameraRef.current.tx = tx;
            cameraRef.current.ty = ty;
            dragRef.current.lx = e.nativeEvent.pageX;
            dragRef.current.ly = e.nativeEvent.pageY;
          }}
          onResponderRelease={() => {
            dragRef.current.active = false;
          }}
        />
      )}
    </View>
  );
}

// --- Helper functions ---

function drawPaths(
  container: Container,
  nodes: PathNode[],
  states: Record<string, NodeState>,
  pathColor: number,
) {
  if (nodes.length < 2) return;

  const g = acquireGraphics('paths');
  g.zIndex = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    const stateA = states[a.id] || 'locked';
    const stateB = states[b.id] || 'locked';
    const completed = stateA === 'completed' && stateB !== 'locked';
    const isLocked = stateB === 'locked';

    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const cpOff = 35 * (i % 2 === 0 ? 1 : -1);

    g.moveTo(a.x, a.y);
    g.quadraticCurveTo(mx + cpOff, my, b.x, b.y);
    g.stroke({
      width: 5,
      color: completed ? 0x8B7355 : pathColor,
      alpha: isLocked ? 0.25 : 0.7,
      cap: 'round',
      join: 'round',
    });

    if (isLocked) {
      const steps = 20;
      for (let t = 0; t < steps; t += 2) {
        const t1 = t / steps;
        const t2 = Math.min((t + 1) / steps, 1);
        const x1 = bezierPoint(a.x, mx + cpOff, b.x, t1);
        const y1 = bezierPoint(a.y, my, b.y, t1);
        const x2 = bezierPoint(a.x, mx + cpOff, b.x, t2);
        const y2 = bezierPoint(a.y, my, b.y, t2);

        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke({ width: 2, color: 0xAAAAAA, alpha: 0.3 });
      }
    }
  }

  container.addChild(g);
}

function updateBounds(
  nodes: PathNode[],
  dims: { width: number; height: number },
  boundsRef: MutableRefObject<{ minX: number; maxX: number; minY: number; maxY: number }>,
) {
  if (!nodes.length) {
    boundsRef.current = { minX: 0, maxX: dims.width, minY: 0, maxY: dims.height };
    return;
  }
  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  const pad = 120;
  const minX = Math.min(...xs) - pad;
  const maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad;
  const maxY = Math.max(...ys) + pad;
  const spanX = Math.max(maxX - minX, dims.width);
  const spanY = Math.max(maxY - minY, dims.height);
  boundsRef.current = { minX, maxX: minX + spanX, minY, maxY: minY + spanY };
}

function clampCameraTarget(
  tx: number,
  ty: number,
  dims: { width: number; height: number },
  boundsRef: MutableRefObject<{ minX: number; maxX: number; minY: number; maxY: number }>,
) {
  const { minX, maxX, minY, maxY } = boundsRef.current;
  const minTx = minX;
  const maxTx = maxX - dims.width;
  const minTy = minY;
  const maxTy = maxY - dims.height;
  const clampX = maxTx < minTx ? (minX + maxX - dims.width) / 2 : Math.min(Math.max(tx, minTx), maxTx);
  const clampY = maxTy < minTy ? (minY + maxY - dims.height) / 2 : Math.min(Math.max(ty, minTy), maxTy);
  return { tx: clampX, ty: clampY };
}

function bezierPoint(p0: number, p1: number, p2: number, t: number): number {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

function buildNode(
  node: PathNode,
  state: NodeState,
  onTap: () => void,
): Container {
  const c = new Container();
  c.label = node.id;
  c.x = node.x;
  c.y = node.y;
  c.eventMode = 'static';
  c.cursor = 'pointer';
  c.hitArea = {
    contains: (x: number, y: number) => x * x + y * y <= (NODE_RADIUS + 10) ** 2,
  };
  c.on('pointertap', onTap);

  if (state === 'in_progress') {
    const glow = acquireGraphics('glow');
    glow.circle(0, 0, NODE_RADIUS + 6);
    glow.fill({ color: 0xFFB200, alpha: 0.25 });
    c.addChild(glow);
  }

  const shadow = acquireGraphics('shadow');
  shadow.circle(2, 2, NODE_RADIUS);
  shadow.fill({ color: 0x000000, alpha: 0.1 });
  c.addChild(shadow);

  const bg = acquireGraphics('node-bg');
  bg.circle(0, 0, NODE_RADIUS);
  bg.fill({ color: NODE_COLORS[state] });
  bg.stroke({ width: 2.5, color: NODE_BORDERS[state] });
  c.addChild(bg);

  const iconMap: Record<string, string> = {
    medication: '\u{1F48A}',
    nutrition: '\u{1F957}',
    movement: '\u{1F3C3}',
    wellness: '\u{1F9D8}',
    checkin: '\u{1F4DD}',
  };

  let iconText = '';
  if (state === 'locked') iconText = '\u{1F512}';
  else if (state === 'completed') iconText = '\u2713';
  else if (state === 'skipped') iconText = '\u2014';
  else if (node.category && iconMap[node.category]) iconText = iconMap[node.category];
  else iconText = node.label?.substring(0, 2) || '\u2022';

  const style = new TextStyle({
    fontSize: state === 'completed' || state === 'skipped' ? 18 : 14,
    fill: state === 'locked' ? '#999' : state === 'completed' ? '#fff' : '#333',
    fontWeight: 'bold',
    align: 'center',
  });
  const txt = new PixiText({ text: iconText, style });
  txt.anchor.set(0.5);
  c.addChild(txt);

  if (node.label && state !== 'locked') {
    const lStyle = new TextStyle({
      fontSize: 10,
      fill: '#555',
      fontWeight: '500',
      align: 'center',
    });
    const lbl = new PixiText({ text: node.label, style: lStyle });
    lbl.anchor.set(0.5, 0);
    lbl.y = NODE_RADIUS + 6;
    c.addChild(lbl);
  }

  return c;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { flex: 1 },
});
