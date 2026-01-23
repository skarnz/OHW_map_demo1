"use client";

import JourneyMap from "./components/journey/JourneyMap";

export default function Home() {
  // Demo: simulate some completed milestones
  const completedMilestones = [
    "first-login",
    "first-weigh-in",
    "first-meal-logged",
  ];

  return (
    <div className="w-screen h-screen">
      <JourneyMap
        userProgress={15}
        completedMilestones={completedMilestones}
        currentQuarter={1}
        onMilestoneClick={(milestone) => {
          console.log("Clicked milestone:", milestone);
        }}
      />
    </div>
  );
}
