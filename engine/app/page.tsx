"use client";

import { useState } from "react";
import JourneyMap from "./components/journey/JourneyMap";
import IOSFrame from "./components/ui/iOSFrame";

export default function Home() {
  const [showFrame, setShowFrame] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Demo: simulate some completed milestones
  const completedMilestones = [
    "first-login",
    "first-weigh-in", 
    "first-meal-logged",
  ];

  const mapContent = (
    <JourneyMap
      userProgress={15}
      completedMilestones={completedMilestones}
      currentQuarter={1}
      editMode={editMode}
      onMilestoneClick={(milestone) => {
        console.log("Clicked milestone:", milestone);
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Control bar */}
      <div className="fixed top-4 right-4 z-[100] flex gap-2">
        <button
          onClick={() => setShowFrame(!showFrame)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFrame 
              ? "bg-blue-600 text-white" 
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {showFrame ? "📱 iOS Frame" : "🖥️ Full Screen"}
        </button>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            editMode 
              ? "bg-orange-600 text-white" 
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {editMode ? "✏️ Edit Mode" : "👁️ View Mode"}
        </button>
        <a
          href="http://localhost:3001"
          target="_blank"
          className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
        >
          🎨 Sprite Generator
        </a>
      </div>

      {showFrame ? (
        <IOSFrame>{mapContent}</IOSFrame>
      ) : (
        <div className="w-screen h-screen">{mapContent}</div>
      )}
    </div>
  );
}
