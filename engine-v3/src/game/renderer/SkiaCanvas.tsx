import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import {
  Canvas,
  Circle,
  DashPathEffect,
  Group,
  Path,
  Rect,
  Text,
  matchFont,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GameSceneCallbacks, GameSceneProps, NodeState, PathNode, TaskCategory } from '../contracts';
import { COLORS, getSeasonalPalette } from '../../theme/tokens';
import SkiaPropsRenderer from '../props/SkiaPropsRenderer';
import SkiaAvatar, { SkiaAvatarRef } from '../avatar/SkiaAvatar';

const NODE_RADIUS = 28;
const NODE_INNER_RADIUS = 25.5;
const HIT_RADIUS = NODE_RADIUS + 14;
const DRAG_THRESHOLD = 12;
const CAMERA_SPRING_CONFIG = { damping: 20, stiffness: 120, mass: 0.5 };

type ResolvedNode = PathNode & {
  worldX: number;
  worldY: number;
};

type ViewportBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

const NODE_COLORS: Record<NodeState, string> = {
  locked: '#D1D1D1',
  unlocked: '#FFFFFF',
  in_progress: '#FFB200',
  completed: '#34C759',
  skipped: '#A0A0A0',
};

const NODE_BORDERS: Record<NodeState, string> = {
  locked: '#999999',
  unlocked: '#0A84FF',
  in_progress: '#FF8C00',
  completed: '#228B22',
  skipped: '#808080',
};

const CATEGORY_ICONS: Record<TaskCategory, string> = {
  medication: '💊',
  nutrition: '🥗',
  movement: '🏃',
  wellness: '🧘',
  checkin: '📝',
};

interface SkiaCanvasProps {
  sceneProps: GameSceneProps;
  callbacks: GameSceneCallbacks;
}

export default function SkiaCanvas({ sceneProps, callbacks }: SkiaCanvasProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const cameraX = useSharedValue(0);
  const cameraY = useSharedValue(0);
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);
  const cameraInitialized = useRef(false);
  const avatarRef = useRef<SkiaAvatarRef>(null);

  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;
  const scenePropsRef = useRef(sceneProps);
  scenePropsRef.current = sceneProps;

  const palette = useMemo(
    () => getSeasonalPalette(sceneProps.biome, sceneProps.season),
    [sceneProps.biome, sceneProps.season],
  );

  const iconFont = useMemo(
    () => matchFont({ fontSize: 16, fontWeight: '700' }),
    [],
  );
  const iconFontLarge = useMemo(
    () => matchFont({ fontSize: 18, fontWeight: '700' }),
    [],
  );
  const labelFont = useMemo(
    () => matchFont({ fontSize: 11, fontWeight: '500' }),
    [],
  );

  const resolvedNodes = useMemo<ResolvedNode[]>(() => {
    if (dimensions.width <= 0) return [];

    return sceneProps.pathNodes.map((node) => {
      const pos = resolveNodePos(node, dimensions.width);
      return {
        ...node,
        worldX: pos.x,
        worldY: pos.y,
      };
    });
  }, [sceneProps.pathNodes, dimensions.width]);

  const resolvedNodesRef = useRef(resolvedNodes);
  resolvedNodesRef.current = resolvedNodes;

  const bounds = useMemo(
    () => computeBounds(resolvedNodes, dimensions),
    [resolvedNodes, dimensions],
  );

  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;
  const dimensionsRef = useRef(dimensions);
  dimensionsRef.current = dimensions;

  // Shared values for bounds/dimensions so pan gestures can clamp on UI thread
  const boundsMinX = useSharedValue(bounds.minX);
  const boundsMaxX = useSharedValue(bounds.maxX);
  const boundsMinY = useSharedValue(bounds.minY);
  const boundsMaxY = useSharedValue(bounds.maxY);
  const dimsW = useSharedValue(dimensions.width);
  const dimsH = useSharedValue(dimensions.height);

  useEffect(() => {
    boundsMinX.value = bounds.minX;
    boundsMaxX.value = bounds.maxX;
    boundsMinY.value = bounds.minY;
    boundsMaxY.value = bounds.maxY;
    dimsW.value = dimensions.width;
    dimsH.value = dimensions.height;
  }, [bounds, dimensions]);

  const backgroundRect = useMemo(
    () => computeBackgroundRect(resolvedNodes, dimensions),
    [resolvedNodes, dimensions],
  );

  // Center camera on avatar node when scene mounts or dimensions change
  useEffect(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0 || !resolvedNodes.length) return;

    const initial = computeInitialViewport(
      sceneProps.avatarPosition,
      resolvedNodes,
      dimensions,
      bounds,
    );

    if (!cameraInitialized.current) {
      // First mount: snap immediately (no animation)
      cameraX.value = initial.x;
      cameraY.value = initial.y;
      cameraInitialized.current = true;
    } else {
      // Subsequent changes: animate smoothly
      cameraX.value = withSpring(initial.x, CAMERA_SPRING_CONFIG);
      cameraY.value = withSpring(initial.y, CAMERA_SPRING_CONFIG);
    }
  }, [dimensions.width, dimensions.height, resolvedNodes.length, sceneProps.avatarPosition]);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      callbacks.onSceneReady();
    }
  }, [callbacks, dimensions.height, dimensions.width]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
    }
  }, []);

  const handleAvatarArrived = useCallback((nodeId: string) => {
    callbacksRef.current.onAvatarArrived(nodeId);
  }, []);

  const handleCelebrationComplete = useCallback(() => {
    callbacksRef.current.onCelebrationComplete();
  }, []);

  const handleTapAtPosition = useCallback((screenX: number, screenY: number) => {
    const nodes = resolvedNodesRef.current;
    const props = scenePropsRef.current;
    const cbs = callbacksRef.current;
    if (!nodes.length) return;

    const worldX = screenX + cameraX.value;
    const worldY = screenY + cameraY.value;

    for (const node of nodes) {
      const dx = worldX - node.worldX;
      const dy = worldY - node.worldY;
      if (dx * dx + dy * dy > HIT_RADIUS * HIT_RADIUS) continue;

      const state = props.nodeStates[node.id] || 'locked';
      if (state !== 'locked') {
        const showAvatar = props.sceneType === 'weekly' || props.sceneType === 'daily';
        if (showAvatar && avatarRef.current) {
          avatarRef.current.walkTo(node.id);
        } else {
          cbs.onNodeTapped(node.id, node.type);
        }
      }
      return;
    }
  }, [cameraX, cameraY]);

  const panGesture = useMemo(() =>
    Gesture.Pan()
      .minDistance(DRAG_THRESHOLD)
      .onStart(() => {
        'worklet';
        panStartX.value = cameraX.value;
        panStartY.value = cameraY.value;
      })
      .onUpdate((e) => {
        'worklet';
        const targetX = panStartX.value - e.translationX;
        const targetY = panStartY.value - e.translationY;
        const minTx = boundsMinX.value;
        const maxTx = boundsMaxX.value - dimsW.value;
        const minTy = boundsMinY.value;
        const maxTy = boundsMaxY.value - dimsH.value;
        cameraX.value = maxTx < minTx
          ? (boundsMinX.value + boundsMaxX.value - dimsW.value) / 2
          : Math.min(Math.max(targetX, minTx), maxTx);
        cameraY.value = maxTy < minTy
          ? (boundsMinY.value + boundsMaxY.value - dimsH.value) / 2
          : Math.min(Math.max(targetY, minTy), maxTy);
      })
      .onEnd((e) => {
        'worklet';
        const vx = -e.velocityX * 0.15;
        const vy = -e.velocityY * 0.15;
        const targetX = cameraX.value + vx;
        const targetY = cameraY.value + vy;
        const minTx = boundsMinX.value;
        const maxTx = boundsMaxX.value - dimsW.value;
        const minTy = boundsMinY.value;
        const maxTy = boundsMaxY.value - dimsH.value;
        const clampedX = maxTx < minTx
          ? (boundsMinX.value + boundsMaxX.value - dimsW.value) / 2
          : Math.min(Math.max(targetX, minTx), maxTx);
        const clampedY = maxTy < minTy
          ? (boundsMinY.value + boundsMaxY.value - dimsH.value) / 2
          : Math.min(Math.max(targetY, minTy), maxTy);
        cameraX.value = withSpring(clampedX, CAMERA_SPRING_CONFIG);
        cameraY.value = withSpring(clampedY, CAMERA_SPRING_CONFIG);
      }),
    [cameraX, cameraY, panStartX, panStartY, boundsMinX, boundsMaxX, boundsMinY, boundsMaxY, dimsW, dimsH],
  );

  const tapGesture = useMemo(() =>
    Gesture.Tap()
      .maxDistance(DRAG_THRESHOLD)
      .onEnd((e) => {
        runOnJS(handleTapAtPosition)(e.x, e.y);
      }),
    [handleTapAtPosition],
  );

  const composedGesture = useMemo(
    () => Gesture.Race(panGesture, tapGesture),
    [panGesture, tapGesture],
  );

  const cameraTransform = useDerivedValue(() => [
    { translateX: -cameraX.value },
    { translateY: -cameraY.value },
  ]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={styles.canvas}>
            <Canvas style={styles.canvas}>
              <Group transform={cameraTransform}>
                <Rect
                  x={backgroundRect.x}
                  y={backgroundRect.y}
                  width={backgroundRect.width}
                  height={backgroundRect.height}
                  color={toSkiaColor(palette.ground)}
                />

                <SkiaPropsRenderer
                  pathNodes={sceneProps.pathNodes}
                  biome={sceneProps.biome}
                  season={sceneProps.season}
                  screenWidth={dimensions.width}
                />

                {resolvedNodes.slice(0, -1).map((node, index) => {
                  const next = resolvedNodes[index + 1];
                  const path = buildBezierPath(node, next, index);
                  const stateA = sceneProps.nodeStates[node.id] || 'locked';
                  const stateB = sceneProps.nodeStates[next.id] || 'locked';
                  const completed = stateA === 'completed' && stateB !== 'locked';
                  const locked = stateB === 'locked';

                  return (
                    <React.Fragment key={`${node.id}-${next.id}`}>
                      <Path
                        path={path}
                        style="stroke"
                        strokeWidth={7}
                        color={completed ? COLORS.pathCompleted : toSkiaColor(palette.path)}
                        opacity={locked ? 0.3 : 0.8}
                      />
                      {locked && (
                        <Path
                          path={path}
                          style="stroke"
                          strokeWidth={2}
                          color="rgba(170, 170, 170, 0.55)"
                        >
                          <DashPathEffect intervals={[14, 10]} />
                        </Path>
                      )}
                    </React.Fragment>
                  );
                })}

                {resolvedNodes.map((node) => {
                  const state = sceneProps.nodeStates[node.id] || 'locked';
                  const icon = getNodeIcon(node, state);
                  const iconColor = getIconColor(node, state);
                  const iconSize = state === 'completed' || state === 'skipped' ? 18 : 16;
                  const labelOffset = node.label ? estimateTextOffset(node.label, 3.25, 16) : 0;
                  const iconOffset = estimateTextOffset(icon, iconSize * 0.28, iconSize * 0.42);
                  const activeFont = iconSize === 18 ? iconFontLarge : iconFont;

                  return (
                    <React.Fragment key={node.id}>
                      {state === 'in_progress' && (
                        <Circle
                          cx={node.worldX}
                          cy={node.worldY}
                          r={NODE_RADIUS + 6}
                          color="rgba(255, 178, 0, 0.25)"
                        />
                      )}
                      <Circle
                        cx={node.worldX + 2}
                        cy={node.worldY + 2}
                        r={NODE_RADIUS}
                        color="rgba(0, 0, 0, 0.10)"
                      />
                      <Circle
                        cx={node.worldX}
                        cy={node.worldY}
                        r={NODE_RADIUS}
                        color={NODE_BORDERS[state]}
                      />
                      <Circle
                        cx={node.worldX}
                        cy={node.worldY}
                        r={NODE_INNER_RADIUS}
                        color={NODE_COLORS[state]}
                      />
                      <Text
                        x={node.worldX - iconOffset}
                        y={node.worldY + (iconSize * 0.34)}
                        text={icon}
                        font={activeFont}
                        color={iconColor}
                      />
                      {node.label && state !== 'locked' && (
                        <Text
                          x={node.worldX - labelOffset}
                          y={node.worldY + NODE_RADIUS + 18}
                          text={node.label}
                          font={labelFont}
                          color="#555555"
                        />
                      )}
                    </React.Fragment>
                  );
                })}

                {sceneProps.sceneType === 'monthly' && (
                  (() => {
                    const avatarNode = resolvedNodes.find((node) => node.id === sceneProps.avatarPosition);
                    if (!avatarNode) return null;

                    return (
                      <React.Fragment>
                        <Circle
                          cx={avatarNode.worldX}
                          cy={avatarNode.worldY - NODE_RADIUS - 12}
                          r={8}
                          color="#FFFFFF"
                        />
                        <Circle
                          cx={avatarNode.worldX}
                          cy={avatarNode.worldY - NODE_RADIUS - 12}
                          r={6}
                          color={COLORS.accentBlue}
                        />
                      </React.Fragment>
                    );
                  })()
                )}

                {(sceneProps.sceneType === 'weekly' || sceneProps.sceneType === 'daily') && (
                  <SkiaAvatar
                    ref={avatarRef}
                    pathNodes={sceneProps.pathNodes}
                    nodeStates={sceneProps.nodeStates}
                    avatarPosition={sceneProps.avatarPosition}
                    screenWidth={dimensions.width}
                    cameraX={cameraX}
                    cameraY={cameraY}
                    onAvatarArrived={handleAvatarArrived}
                    onCelebrationComplete={handleCelebrationComplete}
                  />
                )}
              </Group>
            </Canvas>
          </Animated.View>
        </GestureDetector>
      )}
    </View>
  );
}

function resolveNodePos(node: PathNode, screenWidth: number): { x: number; y: number } {
  const x = node.x <= 1.0 ? node.x * screenWidth : node.x;
  return { x, y: node.y };
}

function computeBounds(
  nodes: ResolvedNode[],
  dims: { width: number; height: number },
): ViewportBounds {
  if (!nodes.length) {
    return { minX: 0, maxX: dims.width, minY: 0, maxY: dims.height };
  }

  const xs = nodes.map((node) => node.worldX);
  const ys = nodes.map((node) => node.worldY);
  const padX = 80;
  const padTop = 200;
  const padBottom = dims.height * 0.8;
  const minX = Math.min(...xs) - padX;
  const maxX = Math.max(...xs) + padX;
  const minY = Math.min(...ys) - padTop;
  const maxY = Math.max(...ys) + padBottom;

  return {
    minX,
    maxX: minX + Math.max(maxX - minX, dims.width),
    minY,
    maxY: minY + Math.max(maxY - minY, dims.height),
  };
}

function computeInitialViewport(
  avatarPosition: string,
  nodes: ResolvedNode[],
  dims: { width: number; height: number },
  bounds: ViewportBounds,
): { x: number; y: number } {
  if (!nodes.length || dims.width <= 0 || dims.height <= 0) {
    return { x: 0, y: 0 };
  }

  const targetNode = nodes.find((node) => node.id === avatarPosition);
  if (targetNode) {
    return clampViewport(
      targetNode.worldX - dims.width / 2,
      targetNode.worldY - dims.height / 2,
      dims,
      bounds,
    );
  }

  const xs = nodes.map((node) => node.worldX);
  const ys = nodes.map((node) => node.worldY);
  return clampViewport(
    (Math.min(...xs) + Math.max(...xs)) / 2 - dims.width / 2,
    (Math.min(...ys) + Math.max(...ys)) / 2 - dims.height / 2,
    dims,
    bounds,
  );
}

function clampViewport(
  x: number,
  y: number,
  dims: { width: number; height: number },
  bounds: ViewportBounds,
) {
  const minX = bounds.minX;
  const maxX = bounds.maxX - dims.width;
  const minY = bounds.minY;
  const maxY = bounds.maxY - dims.height;

  return {
    x: maxX < minX ? (bounds.minX + bounds.maxX - dims.width) / 2 : Math.min(Math.max(x, minX), maxX),
    y: maxY < minY ? (bounds.minY + bounds.maxY - dims.height) / 2 : Math.min(Math.max(y, minY), maxY),
  };
}

function computeBackgroundRect(
  nodes: ResolvedNode[],
  dims: { width: number; height: number },
) {
  const pad = 150;
  const xs = nodes.map((node) => node.worldX);
  const ys = nodes.map((node) => node.worldY);

  const minX = Math.min(0, ...(xs.length ? xs : [0])) - pad;
  const maxX = Math.max(dims.width, ...(xs.length ? xs : [dims.width])) + pad;
  const minY = Math.min(0, ...(ys.length ? ys : [0])) - pad;
  const maxY = Math.max(dims.height, ...(ys.length ? ys : [dims.height])) + pad;

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function buildBezierPath(a: ResolvedNode, b: ResolvedNode, index: number): string {
  const midX = (a.worldX + b.worldX) / 2;
  const midY = (a.worldY + b.worldY) / 2;
  const controlPointOffset = 35 * (index % 2 === 0 ? 1 : -1);
  return `M ${a.worldX} ${a.worldY} Q ${midX + controlPointOffset} ${midY} ${b.worldX} ${b.worldY}`;
}

function toSkiaColor(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0')}`;
}

function getNodeIcon(node: ResolvedNode, state: NodeState): string {
  if (state === 'locked') return '🔒';
  if (state === 'completed') return '✓';
  if (state === 'skipped') return '—';
  if (node.category) return CATEGORY_ICONS[node.category];
  return node.label?.slice(0, 2) || '•';
}

function getIconColor(node: ResolvedNode, state: NodeState): string {
  if (state === 'locked') return '#999999';
  if (state === 'completed') return '#FFFFFF';
  if (state === 'skipped') return '#555555';
  if (node.category) return '#333333';
  return '#333333';
}

function estimateTextOffset(text: string, factor: number, minimum: number): number {
  return Math.max(minimum, Array.from(text).length * factor);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
});
