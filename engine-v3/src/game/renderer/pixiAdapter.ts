// Adapter to bridge expo-gl's WebGL context with Pixi.js v8
// Pixi.js v8 expects a browser DOM canvas; expo-gl provides a raw WebGL context.
//
// On web: creates a real <canvas> element that proxies getContext to expo-gl's GL context.
// On native: creates a mock object (no DOM available).
// This ensures Pixi v8's ResizeObserver/CanvasObserver doesn't crash.

import { ExpoWebGLRenderingContext } from 'expo-gl';
import { Platform } from 'react-native';

export type MockCanvas = HTMLCanvasElement | MockCanvasObject;

interface MockCanvasObject {
  width: number;
  height: number;
  style: Record<string, string>;
  addEventListener: (...args: unknown[]) => void;
  removeEventListener: (...args: unknown[]) => void;
  getContext: (type: string) => ExpoWebGLRenderingContext | null;
  clientWidth: number;
  clientHeight: number;
  getBoundingClientRect: () => DOMRect;
  setAttribute: (...args: unknown[]) => void;
  getAttribute: () => null;
  parentElement: null;
  ownerDocument: typeof document | null;
}

export function createMockCanvas(
  gl: ExpoWebGLRenderingContext,
  width: number,
  height: number,
): MockCanvas {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    // On web: use a real canvas element so ResizeObserver works
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Intercept getContext to return the expo-gl WebGL context
    const originalGetContext = canvas.getContext.bind(canvas);
    canvas.getContext = ((type: string, attrs?: unknown) => {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') {
        return gl as unknown as RenderingContext;
      }
      return originalGetContext(type, attrs as CanvasRenderingContext2DSettings);
    }) as typeof canvas.getContext;

    return canvas;
  }

  // On native: mock object (no DOM, no ResizeObserver)
  return {
    width,
    height,
    style: {},
    addEventListener: () => {},
    removeEventListener: () => {},
    getContext: (type: string) => {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') {
        return gl;
      }
      return null;
    },
    clientWidth: width,
    clientHeight: height,
    getBoundingClientRect: () => ({
      x: 0,
      y: 0,
      width,
      height,
      top: 0,
      left: 0,
      bottom: height,
      right: width,
      toJSON: () => {},
    }),
    setAttribute: () => {},
    getAttribute: () => null,
    parentElement: null,
    ownerDocument: null,
  };
}
