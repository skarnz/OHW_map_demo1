import Phaser from "phaser";
import { GRID_WIDTH, GRID_HEIGHT, TILE_WIDTH, TILE_HEIGHT } from "../types";

// Calculate canvas size for isometric grid
const isoWidth = (GRID_WIDTH + GRID_HEIGHT) * (TILE_WIDTH / 2);
const isoHeight = (GRID_WIDTH + GRID_HEIGHT) * (TILE_HEIGHT / 2);

// Add padding for buildings that extend above their footprint
const CANVAS_PADDING_TOP = 300;
const CANVAS_PADDING_BOTTOM = 100;

export const GAME_WIDTH = Math.ceil(isoWidth) + TILE_WIDTH * 4;
export const GAME_HEIGHT =
  Math.ceil(isoHeight) + CANVAS_PADDING_TOP + CANVAS_PADDING_BOTTOM;

// Offset to center the grid in the canvas - use full game dimensions for proper isometric placement
// The camera will pan to show the visible portion
export const GRID_OFFSET_X = GAME_WIDTH / 2;
export const GRID_OFFSET_Y = CANVAS_PADDING_TOP;

// World bounds for camera (the full isometric space)
export const WORLD_WIDTH = GAME_WIDTH;
export const WORLD_HEIGHT = GAME_HEIGHT;

export function createGameConfig(
  parent: HTMLElement,
  scene: Phaser.Scene
): Phaser.Types.Core.GameConfig {
  // For mobile, use container size as base and let camera handle panning/zoom
  const containerWidth = parent.clientWidth || 400;
  const containerHeight = parent.clientHeight || 600;
  
  return {
    type: Phaser.AUTO,
    parent,
    width: containerWidth,
    height: containerHeight,
    backgroundColor: "#87CEEB", // Light sky blue for health theme
    pixelArt: false, // Disable for smoother scaling on mobile
    roundPixels: false,
    antialias: true,
    scene,
    scale: {
      mode: Phaser.Scale.RESIZE, // Auto-resize with container
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      pixelArt: false,
      antialias: true,
      batchSize: 2048, // Increase batch size for better performance
      maxLights: 0, // Disable lights for performance
    },
    fps: {
      target: 60,
      min: 30,
      forceSetTimeOut: false, // Use requestAnimationFrame for smoother rendering
    },
    // Disable features we don't need
    input: {
      windowEvents: false, // Reduce event listeners
    },
  };
}
