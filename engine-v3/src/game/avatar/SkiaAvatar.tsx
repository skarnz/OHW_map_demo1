import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { Circle, Group, Image, useImage } from '@shopify/react-native-skia';
import {
  SharedValue,
  runOnJS,
  useFrameCallback,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { PathNode } from '../contracts';

export type AvatarState = 'idle' | 'walking' | 'celebrating';

const AVATAR_WIDTH = 48;
const AVATAR_HEIGHT = 64;
const AVATAR_Y_OFFSET = -38;
const WALK_DURATION_PER_NODE = 400;
const CELEBRATE_DURATION_MS = 2000;
const IDLE_FRAME_INTERVAL = 250;
const WALK_FRAME_INTERVAL = 100;
const CELEBRATE_FRAME_INTERVAL = 100;
const IDLE_BOB_AMPLITUDE = 0.5;
const CELEBRATE_BOUNCE_AMPLITUDE = 8;
const CAMERA_SPRING = { damping: 20, stiffness: 120, mass: 0.5 };

export interface SkiaAvatarRef {
  walkTo: (targetNodeId: string) => void;
  celebrate: () => void;
  setPosition: (nodeId: string) => void;
}

interface SkiaAvatarProps {
  pathNodes: PathNode[];
  nodeStates: Record<string, string>;
  avatarPosition: string;
  screenWidth: number;
  cameraX: SharedValue<number>;
  cameraY: SharedValue<number>;
  onAvatarArrived: (nodeId: string) => void;
  onCelebrationComplete: () => void;
}

function resolveNodePos(node: PathNode, screenWidth: number) {
  const x = node.x <= 1.0 ? node.x * screenWidth : node.x;
  return { x, y: node.y };
}

const SkiaAvatar = React.forwardRef<SkiaAvatarRef, SkiaAvatarProps>(
  function SkiaAvatar(
    {
      pathNodes,
      nodeStates,
      avatarPosition,
      screenWidth,
      cameraX,
      cameraY,
      onAvatarArrived,
      onCelebrationComplete,
    },
    ref,
  ) {
    const avatarX = useSharedValue(0);
    const avatarY = useSharedValue(0);
    const bobOffset = useSharedValue(0);
    const facing = useSharedValue(1);
    const frameIndex = useSharedValue(0);

    const stateRef = useRef<AvatarState>('idle');
    const currentNodeIdRef = useRef(avatarPosition);
    const walkQueueRef = useRef<{ x: number; y: number }[]>([]);
    const walkStepRef = useRef(0);
    const targetNodeIdRef = useRef('');
    const frameTimerRef = useRef(0);
    const celebrateTimerRef = useRef(0);

    const idleFrame1 = useImage(require('../../assets/avatar/idle/frame1.png'));
    const idleFrame2 = useImage(require('../../assets/avatar/idle/frame2.png'));
    const idleFrame3 = useImage(require('../../assets/avatar/idle/frame3.png'));
    const idleFrame4 = useImage(require('../../assets/avatar/idle/frame4.png'));

    const walkFrame1 = useImage(require('../../assets/avatar/walk/frame1.png'));
    const walkFrame2 = useImage(require('../../assets/avatar/walk/frame2.png'));
    const walkFrame3 = useImage(require('../../assets/avatar/walk/frame3.png'));
    const walkFrame4 = useImage(require('../../assets/avatar/walk/frame4.png'));
    const walkFrame5 = useImage(require('../../assets/avatar/walk/frame5.png'));
    const walkFrame6 = useImage(require('../../assets/avatar/walk/frame6.png'));

    const celebFrame1 = useImage(require('../../assets/avatar/celebrate/frame1.png'));
    const celebFrame2 = useImage(require('../../assets/avatar/celebrate/frame2.png'));
    const celebFrame3 = useImage(require('../../assets/avatar/celebrate/frame3.png'));
    const celebFrame4 = useImage(require('../../assets/avatar/celebrate/frame4.png'));
    const celebFrame5 = useImage(require('../../assets/avatar/celebrate/frame5.png'));
    const celebFrame6 = useImage(require('../../assets/avatar/celebrate/frame6.png'));

    const idleFrames = [idleFrame1, idleFrame2, idleFrame3, idleFrame4];
    const walkFrames = [walkFrame1, walkFrame2, walkFrame3, walkFrame4, walkFrame5, walkFrame6];
    const celebFrames = [celebFrame1, celebFrame2, celebFrame3, celebFrame4, celebFrame5, celebFrame6];

    const spritesLoaded =
      idleFrames.every(Boolean) && walkFrames.every(Boolean) && celebFrames.every(Boolean);

    const snapToNode = useCallback(
      (nodeId: string) => {
        const node = pathNodes.find((n) => n.id === nodeId);
        if (!node) return;
        const pos = resolveNodePos(node, screenWidth);
        avatarX.value = pos.x;
        avatarY.value = pos.y + AVATAR_Y_OFFSET;
        currentNodeIdRef.current = nodeId;
      },
      [pathNodes, screenWidth, avatarX, avatarY],
    );

    useEffect(() => {
      snapToNode(avatarPosition);
    }, [avatarPosition, snapToNode]);

    const advanceWalk = useCallback(() => {
      const queue = walkQueueRef.current;
      const step = walkStepRef.current;

      if (step >= queue.length) {
        stateRef.current = 'idle';
        frameIndex.value = 0;
        const nodeId = targetNodeIdRef.current;
        currentNodeIdRef.current = nodeId;
        onAvatarArrived(nodeId);
        return;
      }

      const target = queue[step];
      const prevX = avatarX.value;

      if (target.x > prevX) facing.value = 1;
      else if (target.x < prevX) facing.value = -1;

      avatarX.value = withTiming(target.x, { duration: WALK_DURATION_PER_NODE }, () => {
        runOnJS(advanceWalkStep)();
      });
      avatarY.value = withTiming(target.y, { duration: WALK_DURATION_PER_NODE });

      cameraX.value = withSpring(
        target.x - screenWidth / 2,
        CAMERA_SPRING,
      );
      cameraY.value = withSpring(target.y - 200, CAMERA_SPRING);
    }, [avatarX, avatarY, cameraX, cameraY, facing, frameIndex, onAvatarArrived, screenWidth]);

    const advanceWalkStep = useCallback(() => {
      walkStepRef.current += 1;
      advanceWalk();
    }, [advanceWalk]);

    const walkTo = useCallback(
      (targetNodeId: string) => {
        if (stateRef.current === 'walking') return;

        const currentId = currentNodeIdRef.current;
        const startIdx = pathNodes.findIndex((n) => n.id === currentId);
        const endIdx = pathNodes.findIndex((n) => n.id === targetNodeId);
        if (startIdx === -1 || endIdx === -1 || startIdx === endIdx) {
          onAvatarArrived(targetNodeId);
          return;
        }

        const step = startIdx < endIdx ? 1 : -1;
        const waypoints: { x: number; y: number }[] = [];
        for (let i = startIdx + step; i !== endIdx + step; i += step) {
          const n = pathNodes[i];
          const pos = resolveNodePos(n, screenWidth);
          waypoints.push({ x: pos.x, y: pos.y + AVATAR_Y_OFFSET });
        }

        walkQueueRef.current = waypoints;
        walkStepRef.current = 0;
        targetNodeIdRef.current = targetNodeId;
        stateRef.current = 'walking';
        frameIndex.value = 0;
        advanceWalk();
      },
      [pathNodes, screenWidth, frameIndex, advanceWalk, onAvatarArrived],
    );

    const celebrate = useCallback(() => {
      if (stateRef.current === 'celebrating') return;
      stateRef.current = 'celebrating';
      celebrateTimerRef.current = 0;
      frameIndex.value = 0;
    }, [frameIndex]);

    const setPosition = useCallback(
      (nodeId: string) => {
        snapToNode(nodeId);
      },
      [snapToNode],
    );

    useImperativeHandle(ref, () => ({ walkTo, celebrate, setPosition }), [
      walkTo,
      celebrate,
      setPosition,
    ]);

    useFrameCallback((info) => {
      const dt = info.timeSincePreviousFrame ?? 16;
      const state = stateRef.current;

      if (state === 'idle') {
        frameTimerRef.current += dt;
        if (frameTimerRef.current >= IDLE_FRAME_INTERVAL) {
          frameTimerRef.current = 0;
          frameIndex.value = (frameIndex.value + 1) % 4;
        }
        const t = Date.now() * 0.002;
        bobOffset.value = Math.sin(t) * IDLE_BOB_AMPLITUDE;
      } else if (state === 'walking') {
        frameTimerRef.current += dt;
        if (frameTimerRef.current >= WALK_FRAME_INTERVAL) {
          frameTimerRef.current = 0;
          frameIndex.value = (frameIndex.value + 1) % 6;
        }
        bobOffset.value = 0;
      } else if (state === 'celebrating') {
        frameTimerRef.current += dt;
        celebrateTimerRef.current += dt;
        if (frameTimerRef.current >= CELEBRATE_FRAME_INTERVAL) {
          frameTimerRef.current = 0;
          frameIndex.value = (frameIndex.value + 1) % 6;
        }
        const t = celebrateTimerRef.current * 0.005;
        bobOffset.value = Math.sin(t * 3) * CELEBRATE_BOUNCE_AMPLITUDE;

        if (celebrateTimerRef.current >= CELEBRATE_DURATION_MS) {
          stateRef.current = 'idle';
          bobOffset.value = 0;
          frameIndex.value = 0;
          runOnJS(onCelebrationComplete)();
        }
      }
    });

    const getCurrentFrameImage = () => {
      const idx = frameIndex.value;
      const state = stateRef.current;
      if (state === 'walking') return walkFrames[idx % walkFrames.length];
      if (state === 'celebrating') return celebFrames[idx % celebFrames.length];
      return idleFrames[idx % idleFrames.length];
    };

    const currentImage = getCurrentFrameImage();
    const drawX = avatarX.value - AVATAR_WIDTH / 2;
    const drawY = avatarY.value + bobOffset.value - AVATAR_HEIGHT;

    if (spritesLoaded && currentImage) {
      return (
        <Group
          transform={[
            { translateX: avatarX.value },
            { translateY: avatarY.value },
            { scaleX: facing.value },
            { translateX: -avatarX.value },
          ]}
        >
          <Image
            image={currentImage}
            x={drawX}
            y={drawY + bobOffset.value}
            width={AVATAR_WIDTH}
            height={AVATAR_HEIGHT}
          />
        </Group>
      );
    }

    return (
      <Group
        transform={[
          { translateX: avatarX.value },
          { translateY: avatarY.value },
          { scaleX: facing.value },
          { translateX: -avatarX.value },
        ]}
      >
        <Circle
          cx={avatarX.value}
          cy={avatarY.value + bobOffset.value - AVATAR_HEIGHT / 2}
          r={16}
          color="#0A84FF"
        />
        <Circle
          cx={avatarX.value}
          cy={avatarY.value + bobOffset.value - AVATAR_HEIGHT / 2 - 14}
          r={10}
          color="#FFD4A3"
        />
      </Group>
    );
  },
);

export default SkiaAvatar;
