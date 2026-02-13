"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  TileType,
  ToolType,
  GridCell,
  Direction,
  GRID_WIDTH,
  GRID_HEIGHT,
} from "../game/types";
import { getBuilding } from "@/app/data/buildings";
import {
  DEFAULT_JOURNEY,
  getAllMilestones,
  calculateMilestonePosition,
  generateJourneyPath,
  HealthMilestone,
  JourneyQuarter,
  MILESTONE_CATEGORY_INFO,
} from "@/app/data/milestones";

interface GeneratedSprite {
  id: string;
  name: string;
  category: string;
  size: string;
  spritePath: string;
  generatedAt: string;
}
import dynamic from "next/dynamic";
import type { PhaserGameHandle } from "../game/phaser/PhaserGame";

const PhaserGame = dynamic(() => import("../game/phaser/PhaserGame"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-emerald-200 text-gray-600 text-lg">
      Loading map...
    </div>
  ),
});

interface JourneyMapProps {
  userProgress?: number; // 0-100 percentage through the journey
  completedMilestones?: string[]; // IDs of completed milestones
  currentQuarter?: 1 | 2 | 3 | 4;
  editMode?: boolean; // Enable drag-and-drop editing
  onMilestoneClick?: (milestone: HealthMilestone) => void;
}

// Generate the journey grid with milestones placed
function generateJourneyGrid(
  milestones: HealthMilestone[],
  completedMilestones: string[]
): GridCell[][] {
  // Initialize empty grass grid
  const grid: GridCell[][] = Array.from({ length: GRID_HEIGHT }, (_, y) =>
    Array.from({ length: GRID_WIDTH }, (_, x) => ({
      type: TileType.Grass,
      x,
      y,
      isOrigin: true,
    }))
  );

  // First, place milestone buildings (so path doesn't overwrite them)
  const buildingTiles = new Set<string>();
  
  for (const milestone of milestones) {
    const pos = calculateMilestonePosition(milestone.order);
    const building = getBuilding(milestone.buildingId);
    
    if (!building) {
      console.warn(`Building not found: ${milestone.buildingId} for milestone ${milestone.name}`);
      continue;
    }
    
    const footprint = building.footprint;
    const originX = pos.x;
    const originY = pos.y;

    // Removed console.log for performance

    // Check bounds
    if (
      originX < 0 ||
      originY < 0 ||
      originX + footprint.width > GRID_WIDTH ||
      originY + footprint.height > GRID_HEIGHT
    ) {
      console.warn(`Milestone ${milestone.name} out of bounds at (${originX}, ${originY})`);
      continue;
    }

    // Place building tiles
    for (let dy = 0; dy < footprint.height; dy++) {
      for (let dx = 0; dx < footprint.width; dx++) {
        const px = originX + dx;
        const py = originY + dy;
        if (px < GRID_WIDTH && py < GRID_HEIGHT) {
          grid[py][px].type = TileType.Building;
          grid[py][px].buildingId = milestone.buildingId;
          grid[py][px].isOrigin = dx === 0 && dy === 0;
          grid[py][px].originX = originX;
          grid[py][px].originY = originY;
          buildingTiles.add(`${px},${py}`);
        }
      }
    }
  }

  // Then generate path tiles connecting milestones (skip building tiles)
  const pathTiles = generateJourneyPath(milestones, (completedMilestones.length / milestones.length) * 100);
  
  for (const tile of pathTiles) {
    const key = `${tile.x},${tile.y}`;
    if (tile.x >= 0 && tile.x < GRID_WIDTH && tile.y >= 0 && tile.y < GRID_HEIGHT) {
      // Don't overwrite building tiles
      if (!buildingTiles.has(key)) {
        grid[tile.y][tile.x].type = tile.completed ? TileType.Road : TileType.Tile;
      }
    }
  }

  // Grid generation complete - removed console.log for performance

  return grid;
}

export default function JourneyMap({
  userProgress = 0,
  completedMilestones = [],
  currentQuarter = 1,
  editMode = false,
  onMilestoneClick,
}: JourneyMapProps) {
  // Memoize milestones to prevent infinite re-render loop
  const milestones = useMemo(() => getAllMilestones(), []);
  
  // Memoize grid generation - only regenerate when completedMilestones changes
  const grid = useMemo(() => 
    generateJourneyGrid(milestones, completedMilestones),
    [milestones, completedMilestones]
  );
  
  const [zoom, setZoom] = useState(0.5); // Start zoomed out to see more
  const [selectedMilestone, setSelectedMilestone] = useState<HealthMilestone | null>(null);
  const [showQuarterPanel, setShowQuarterPanel] = useState(true);
  const [selectedTool, setSelectedTool] = useState<ToolType>(ToolType.None);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [generatedSprites, setGeneratedSprites] = useState<GeneratedSprite[]>([]);
  const [showSpritePalette, setShowSpritePalette] = useState(false);

  const phaserGameRef = useRef<PhaserGameHandle>(null);

  // Load generated sprites when in edit mode
  useEffect(() => {
    if (editMode) {
      fetch('/api/sprites')
        .then(res => res.json())
        .then(data => {
          setGeneratedSprites(data.sprites || []);
        })
        .catch(err => console.error('Failed to load sprites:', err));
    }
  }, [editMode]);

  // Center camera on milestones and spawn user avatar when game is ready
  useEffect(() => {
    const centerCamera = () => {
      if (phaserGameRef.current) {
        // Center on the first row of milestones
        // Milestones are at x: 12, 22, 32 and start at y: 38, then go up
        phaserGameRef.current.centerOnGridPosition(22, 32);
        // Spawn character at user's current progress point
        phaserGameRef.current.spawnCharacter();
      } else {
        setTimeout(centerCamera, 500);
      }
    };
    
    // Wait for Phaser to fully initialize
    const timer = setTimeout(centerCamera, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle clicking on milestones
  const handleTileClick = useCallback(
    (x: number, y: number) => {
      const cell = grid[y]?.[x];
      if (cell?.type === TileType.Building && cell.buildingId) {
        // Find which milestone this building belongs to
        const milestone = milestones.find((m) => {
          const pos = calculateMilestonePosition(m.order);
          const building = getBuilding(m.buildingId);
          if (!building) return false;
          
          return (
            x >= pos.x &&
            x < pos.x + building.footprint.width &&
            y >= pos.y &&
            y < pos.y + building.footprint.height
          );
        });

        if (milestone) {
          setSelectedMilestone(milestone);
          onMilestoneClick?.(milestone);
        }
      }
    },
    [grid, milestones, onMilestoneClick]
  );

  // Use ref for zoom to avoid re-render loops from Phaser's zoom callbacks
  const zoomRef = useRef(0.5);
  const handleZoomChange = useCallback((newZoom: number) => {
    zoomRef.current = newZoom;
  }, []);

  // Calculate progress stats
  const totalMilestones = milestones.length;
  const completedCount = completedMilestones.length;
  const progressPercent = Math.round((completedCount / totalMilestones) * 100);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-teal-100 to-purple-100">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Mission Journey</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="absolute top-16 left-4 right-4 z-40">
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-green-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {completedCount}/{totalMilestones}
          </span>
        </div>
      </div>

      {/* Quarter Navigation */}
      {showQuarterPanel && (
        <div className="absolute left-4 top-28 z-40 space-y-2">
          {DEFAULT_JOURNEY.map((quarter) => {
            const isActive = quarter.id === currentQuarter;
            const quarterMilestones = quarter.milestones;
            const quarterCompleted = quarterMilestones.filter((m) =>
              completedMilestones.includes(m.id)
            ).length;
            const allComplete = quarterCompleted === quarterMilestones.length;
            const isLocked = quarter.id > currentQuarter && !allComplete;

            return (
              <div
                key={quarter.id}
                className={`
                  bg-white/90 backdrop-blur-sm rounded-xl p-3 w-48 transition-all
                  ${isActive ? "ring-2 ring-teal-500 shadow-lg" : "opacity-80"}
                  ${isLocked ? "opacity-50" : ""}
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-xl
                      ${allComplete ? "bg-green-100" : isActive ? "bg-teal-100" : "bg-gray-100"}
                    `}
                  >
                    {isLocked ? "🔒" : allComplete ? "✅" : quarter.id === 1 ? "🏠" : quarter.id === 2 ? "🏃" : quarter.id === 3 ? "🎯" : "🏆"}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Quarter {quarter.id}:</p>
                    <p className="font-semibold text-gray-800 text-sm">{quarter.title}</p>
                    <div className="flex gap-1 mt-1">
                      {quarterMilestones.slice(0, 3).map((m, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 rounded-full text-xs flex items-center justify-center
                            ${completedMilestones.includes(m.id) ? "bg-green-500 text-white" : "bg-gray-200"}
                          `}
                        >
                          {completedMilestones.includes(m.id) ? "✓" : ""}
                        </span>
                      ))}
                      {quarterMilestones.length > 3 && (
                        <span className="text-xs text-gray-400">+{quarterMilestones.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toggle Quarter Panel */}
      <button
        onClick={() => setShowQuarterPanel(!showQuarterPanel)}
        className="absolute left-4 bottom-24 z-40 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
      >
        {showQuarterPanel ? "◀" : "▶"}
      </button>

      {/* Zoom Controls */}
      <div className="absolute right-4 bottom-24 z-40 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(z * 1.5, 4))}
          className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z / 1.5, 0.25))}
          className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white"
        >
          -
        </button>
      </div>

      {/* Edit Mode Toolbar */}
      {editMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-orange-600/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3">
          <span className="text-white text-sm font-medium">✏️ Edit Mode</span>
          <div className="w-px h-6 bg-white/30" />
          <button
            onClick={() => {
              setSelectedTool(ToolType.Building);
              setShowSpritePalette(true);
            }}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedTool === ToolType.Building
                ? "bg-white text-orange-600"
                : "text-white hover:bg-white/20"
            }`}
          >
            🏠 Place
          </button>
          <button
            onClick={() => {
              setSelectedTool(ToolType.Eraser);
              setShowSpritePalette(false);
            }}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedTool === ToolType.Eraser
                ? "bg-white text-orange-600"
                : "text-white hover:bg-white/20"
            }`}
          >
            🗑️ Erase
          </button>
          <button
            onClick={() => {
              setSelectedTool(ToolType.None);
              setShowSpritePalette(false);
            }}
            className="px-3 py-1 rounded-lg text-sm text-white hover:bg-white/20"
          >
            ✋ Pan
          </button>
          <div className="w-px h-6 bg-white/30" />
          <span className="text-white/60 text-xs">
            {generatedSprites.length} sprites loaded
          </span>
        </div>
      )}

      {/* Sprite Palette (when in Place mode) */}
      {editMode && showSpritePalette && (
        <div className="absolute top-36 left-4 z-40 bg-gray-900/95 backdrop-blur-sm rounded-xl p-3 w-48 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-sm font-medium">🎨 Sprites</h3>
            <button 
              onClick={() => setShowSpritePalette(false)}
              className="text-white/60 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          
          {generatedSprites.length === 0 ? (
            <div className="text-gray-400 text-xs py-4 text-center">
              No sprites yet.<br/>
              <a 
                href="http://localhost:3001" 
                target="_blank" 
                className="text-green-400 hover:underline"
              >
                Generate some →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {generatedSprites.map(sprite => (
                <button
                  key={sprite.id}
                  onClick={() => setSelectedBuildingId(sprite.id)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    selectedBuildingId === sprite.id
                      ? "border-orange-500 bg-orange-500/20"
                      : "border-transparent bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <img 
                    src={sprite.spritePath} 
                    alt={sprite.name}
                    className="w-full h-16 object-contain bg-white rounded"
                  />
                  <div className="text-white text-[10px] mt-1 truncate">{sprite.name}</div>
                  <div className="text-gray-500 text-[9px]">{sprite.size}</div>
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-3 pt-2 border-t border-gray-700">
            <a
              href="http://localhost:3001"
              target="_blank"
              className="block w-full text-center py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
            >
              + Generate New Sprite
            </a>
          </div>
        </div>
      )}

      {/* Game Canvas */}
      <div className="absolute inset-0 pt-16">
        <PhaserGame
          ref={phaserGameRef}
          grid={grid}
          selectedTool={editMode ? selectedTool : ToolType.None}
          selectedBuildingId={editMode ? selectedBuildingId : null}
          buildingOrientation={Direction.Down}
          zoom={zoom}
          onTileClick={handleTileClick}
          onZoomChange={handleZoomChange}
          showPaths={false}
          showStats={editMode}
        />
      </div>

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedMilestone(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{
                  backgroundColor: MILESTONE_CATEGORY_INFO[selectedMilestone.category].color + "20",
                }}
              >
                {MILESTONE_CATEGORY_INFO[selectedMilestone.category].icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedMilestone.name}</h2>
                <p className="text-sm text-gray-500">
                  {MILESTONE_CATEGORY_INFO[selectedMilestone.category].name}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{selectedMilestone.description}</p>
            {selectedMilestone.targetValue && (
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-500">Target</p>
                <p className="text-2xl font-bold text-gray-800">
                  {selectedMilestone.targetValue} {selectedMilestone.unit}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
              {completedMilestones.includes(selectedMilestone.id) ? (
                <div className="flex-1 py-3 bg-green-100 rounded-xl font-medium text-green-700 text-center">
                  ✓ Completed
                </div>
              ) : (
                <button className="flex-1 py-3 bg-teal-500 rounded-xl font-medium text-white hover:bg-teal-600">
                  View Details
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {[
            { icon: "🍽️", label: "Log Meal" },
            { icon: "💪", label: "Fitness" },
            { icon: "🗺️", label: "Journey", active: true },
            { icon: "📚", label: "Education" },
            { icon: "📊", label: "Progress" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center p-2 ${
                item.active ? "text-teal-600" : "text-gray-500"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
