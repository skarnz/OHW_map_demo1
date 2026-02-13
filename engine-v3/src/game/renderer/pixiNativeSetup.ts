// Polyfill and adapter setup for Pixi.js v8 on React Native (no DOM).
// Must be imported BEFORE any pixi.js imports in the app.
//
// Pixi v8 expects browser globals: document, window.addEventListener, etc.
// On React Native there's no DOM, so we shim the bare minimum needed by:
//   - BrowserAdapter: document.createElement('canvas')
//   - AccessibilitySystem: document.createElement, document.body
//   - EventSystem: globalThis.document.addEventListener, globalThis.addEventListener
//   - EventTicker: globalThis.document.dispatchEvent
//   - DOMPipe: element.remove(), element.contains()
//   - CanvasTextMetrics: canvas.getContext('2d').font/measureText

import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  const noop = () => {};

  // Pixi's EventSystem, AccessibilitySystem, and ResizePlugin call
  // globalThis.addEventListener/removeEventListener
  if (typeof globalThis.addEventListener === 'undefined') {
    (globalThis as Record<string, unknown>).addEventListener = noop;
    (globalThis as Record<string, unknown>).removeEventListener = noop;
  }

  // Fake 2D canvas context for Pixi's CanvasTextMetrics
  function createMock2DContext() {
    return {
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      textAlign: 'left',
      textBaseline: 'alphabetic',
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      direction: 'ltr',
      canvas: { width: 0, height: 0 },
      measureText: (text: string) => ({
        width: text.length * 8,
        actualBoundingBoxAscent: 10,
        actualBoundingBoxDescent: 2,
        fontBoundingBoxAscent: 12,
        fontBoundingBoxDescent: 3,
      }),
      fillText: noop,
      strokeText: noop,
      clearRect: noop,
      fillRect: noop,
      strokeRect: noop,
      save: noop,
      restore: noop,
      scale: noop,
      rotate: noop,
      translate: noop,
      transform: noop,
      setTransform: noop,
      resetTransform: noop,
      beginPath: noop,
      closePath: noop,
      moveTo: noop,
      lineTo: noop,
      arc: noop,
      arcTo: noop,
      rect: noop,
      fill: noop,
      stroke: noop,
      clip: noop,
      drawImage: noop,
      createLinearGradient: () => ({ addColorStop: noop }),
      createRadialGradient: () => ({ addColorStop: noop }),
      createPattern: () => null,
      getImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0 }),
      putImageData: noop,
      setLineDash: noop,
      getLineDash: () => [],
    };
  }

  // Minimal DOM element shim with all methods Pixi may call
  function createMockElement(): Record<string, unknown> {
    const el: Record<string, unknown> = {
      style: {},
      appendChild: (child: unknown) => child,
      removeChild: noop,
      addEventListener: noop,
      removeEventListener: noop,
      setAttribute: noop,
      getAttribute: () => null,
      contains: () => false,
      remove: noop,
      getBoundingClientRect: () => ({
        x: 0, y: 0, width: 0, height: 0,
        top: 0, left: 0, bottom: 0, right: 0,
        toJSON: noop,
      }),
      parentElement: null,
      parentNode: null,
      ownerDocument: null,
      title: '',
      tagName: 'DIV',
      id: '',
      className: '',
      classList: { add: noop, remove: noop, contains: () => false, toggle: noop },
      children: [],
      childNodes: [],
      firstChild: null,
      lastChild: null,
      innerHTML: '',
      textContent: '',
      getContext: (type: string) => {
        if (type === '2d') return createMock2DContext();
        return null;
      },
    };
    return el;
  }

  if (typeof globalThis.document === 'undefined') {
    const body = createMockElement();

    (globalThis as Record<string, unknown>).document = {
      createElement: () => createMockElement(),
      createElementNS: () => createMockElement(),
      body,
      addEventListener: noop,
      removeEventListener: noop,
      dispatchEvent: noop,
      baseURI: '',
      fonts: null,
      head: createMockElement(),
      documentElement: createMockElement(),
      querySelector: () => null,
      querySelectorAll: () => [],
      createTextNode: () => createMockElement(),
    };
  }

  // Some Pixi code checks for window properties
  if (typeof (globalThis as Record<string, unknown>).window === 'undefined') {
    (globalThis as Record<string, unknown>).window = globalThis;
  }
}
