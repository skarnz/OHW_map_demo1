"use client";

import { useMemo, useCallback } from "react";
import JourneyMap from "./components/journey/JourneyMap";
import IOSFrame from "./components/ui/iOSFrame";

export default function Home() {
  const completedMilestones = useMemo(() => [
    "journey-start",
    "first-weigh-in",
    "first-meal",
  ], []);
  
  const handleMilestoneClick = useCallback((milestone: { name: string }) => {
    console.log("Tapped milestone:", milestone);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* OHW Logo Watermark */}
      <div className="fixed top-6 left-6 z-50 opacity-80">
        <img 
          src="/ohw-logo.jpg" 
          alt="Operation Health & Wellness" 
          className="w-16 h-16 rounded-xl shadow-lg"
        />
      </div>
      
      {/* Title */}
      <div className="fixed top-6 left-28 z-50">
        <h1 className="text-white text-xl font-bold">OHW Journey Map</h1>
        <p className="text-blue-300 text-sm">Interactive Health Journey Prototype</p>
      </div>

      {/* iPhone Frame with App */}
      <IOSFrame>
        <JourneyMap
          userProgress={15}
          completedMilestones={completedMilestones}
          currentQuarter={1}
          editMode={false}
          onMilestoneClick={handleMilestoneClick}
        />
      </IOSFrame>
      
      {/* Feature callouts */}
      <div className="fixed bottom-6 left-6 z-50 text-white/70 text-xs space-y-1">
        <div>✓ 4 Zoom Levels: Q → M → W → D</div>
        <div>✓ Streak & Points Gamification</div>
        <div>✓ AI-Generated Building Sprites</div>
        <div>✓ iOS Native Ready (Capacitor)</div>
      </div>
    </div>
  );
}
