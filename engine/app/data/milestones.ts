// Health Journey Milestones Registry
// Milestones are buildings that represent health achievements on the journey map

import { BuildingDefinition, BUILDINGS, registerBuilding } from './buildings';

export type MilestoneCategory =
  | "weight_milestone"
  | "activity_milestone"
  | "nutrition_milestone"
  | "wellness_milestone"
  | "quarter_landmark"
  | "journey_decoration";

export interface HealthMilestone {
  id: string;
  name: string;
  description: string;
  category: MilestoneCategory;
  quarter: 1 | 2 | 3 | 4;
  order: number; // Position in the journey (1 = first milestone)
  targetValue?: number;
  unit?: string;
  buildingId: string; // References a building in buildings.ts
  unlockCondition?: string;
}

// Journey structure - 4 quarters, each with milestones
export interface JourneyQuarter {
  id: number;
  name: string;
  title: string;
  description: string;
  months: string;
  milestones: HealthMilestone[];
}

// Default 12-month OHW journey structure
export const DEFAULT_JOURNEY: JourneyQuarter[] = [
  {
    id: 1,
    name: "Quarter 1",
    title: "Basic Foundation",
    description: "Establish healthy habits and get started on your journey",
    months: "Months 1-3",
    milestones: [
      {
        id: "first-login",
        name: "Journey Begins",
        description: "Complete your first app login and setup",
        category: "wellness_milestone",
        quarter: 1,
        order: 1,
        buildingId: "fountain", // Placeholder - will be replaced with health-themed sprite
      },
      {
        id: "first-weigh-in",
        name: "First Weigh-In",
        description: "Record your starting weight",
        category: "weight_milestone",
        quarter: 1,
        order: 2,
        buildingId: "park-table",
      },
      {
        id: "first-meal-logged",
        name: "First Meal Logged",
        description: "Log your first meal in the app",
        category: "nutrition_milestone",
        quarter: 1,
        order: 3,
        buildingId: "flower-bush",
      },
      {
        id: "5lb-lost",
        name: "5 Pounds Lost",
        description: "Reach your first weight loss milestone",
        category: "weight_milestone",
        quarter: 1,
        order: 4,
        targetValue: 5,
        unit: "lbs",
        buildingId: "christmas-cottage", // Placeholder
      },
      {
        id: "first-workout",
        name: "First Workout",
        description: "Complete your first tracked workout",
        category: "activity_milestone",
        quarter: 1,
        order: 5,
        buildingId: "modern-bench",
      },
      {
        id: "q1-complete",
        name: "Q1 Complete",
        description: "Complete Quarter 1 of your journey",
        category: "quarter_landmark",
        quarter: 1,
        order: 6,
        buildingId: "christmas-clock-tower",
      },
    ],
  },
  {
    id: 2,
    name: "Quarter 2",
    title: "Active Progress",
    description: "Build momentum and see real results",
    months: "Months 4-6",
    milestones: [
      {
        id: "10lb-lost",
        name: "10 Pounds Lost",
        description: "Reach double digits in weight loss",
        category: "weight_milestone",
        quarter: 2,
        order: 7,
        targetValue: 10,
        unit: "lbs",
        buildingId: "yellow-apartments",
      },
      {
        id: "7-day-streak",
        name: "7-Day Streak",
        description: "Log meals for 7 consecutive days",
        category: "nutrition_milestone",
        quarter: 2,
        order: 8,
        targetValue: 7,
        unit: "days",
        buildingId: "english-townhouse",
      },
      {
        id: "first-workout-streak",
        name: "Workout Streak",
        description: "Complete 5 workouts in a week",
        category: "activity_milestone",
        quarter: 2,
        order: 9,
        targetValue: 5,
        unit: "workouts",
        buildingId: "limestone",
      },
      {
        id: "hydration-goal",
        name: "Hydration Champion",
        description: "Meet daily water intake goal for a week",
        category: "wellness_milestone",
        quarter: 2,
        order: 10,
        buildingId: "statue",
      },
      {
        id: "15lb-lost",
        name: "15 Pounds Lost",
        description: "Continue your amazing progress",
        category: "weight_milestone",
        quarter: 2,
        order: 11,
        targetValue: 15,
        unit: "lbs",
        buildingId: "brownstone",
      },
      {
        id: "q2-complete",
        name: "Q2 Complete",
        description: "Complete Quarter 2 - halfway there!",
        category: "quarter_landmark",
        quarter: 2,
        order: 12,
        buildingId: "bookstore",
      },
    ],
  },
  {
    id: 3,
    name: "Quarter 3",
    title: "Strategic Goals",
    description: "Refine your approach and push toward major milestones",
    months: "Months 7-9",
    milestones: [
      {
        id: "20lb-lost",
        name: "20 Pounds Lost",
        description: "A major milestone achievement",
        category: "weight_milestone",
        quarter: 3,
        order: 13,
        targetValue: 20,
        unit: "lbs",
        buildingId: "80s-apartment",
      },
      {
        id: "30-day-streak",
        name: "30-Day Streak",
        description: "One month of consistent logging",
        category: "nutrition_milestone",
        quarter: 3,
        order: 14,
        targetValue: 30,
        unit: "days",
        buildingId: "row-houses",
      },
      {
        id: "meditation-started",
        name: "Mindfulness Began",
        description: "Complete your first meditation session",
        category: "wellness_milestone",
        quarter: 3,
        order: 15,
        buildingId: "tree-1",
      },
      {
        id: "25lb-lost",
        name: "25 Pounds Lost",
        description: "Quarter way to 100!",
        category: "weight_milestone",
        quarter: 3,
        order: 16,
        targetValue: 25,
        unit: "lbs",
        buildingId: "medium-apartments",
      },
      {
        id: "fitness-level-up",
        name: "Fitness Level Up",
        description: "Increase workout intensity or duration",
        category: "activity_milestone",
        quarter: 3,
        order: 17,
        buildingId: "leafy-apartments",
      },
      {
        id: "q3-complete",
        name: "Q3 Complete",
        description: "Complete Quarter 3 - the home stretch!",
        category: "quarter_landmark",
        quarter: 3,
        order: 18,
        buildingId: "church",
      },
    ],
  },
  {
    id: 4,
    name: "Quarter 4",
    title: "Ultimate Wellbeing",
    description: "Achieve your goals and celebrate your transformation",
    months: "Months 10-12",
    milestones: [
      {
        id: "30lb-lost",
        name: "30 Pounds Lost",
        description: "Incredible achievement!",
        category: "weight_milestone",
        quarter: 4,
        order: 19,
        targetValue: 30,
        unit: "lbs",
        buildingId: "gothic-apartments",
      },
      {
        id: "90-day-streak",
        name: "90-Day Streak",
        description: "Three months of dedication",
        category: "nutrition_milestone",
        quarter: 4,
        order: 20,
        targetValue: 90,
        unit: "days",
        buildingId: "sf-duplex",
      },
      {
        id: "goal-weight",
        name: "Goal Weight",
        description: "Reach your target weight",
        category: "weight_milestone",
        quarter: 4,
        order: 21,
        buildingId: "modern-terra-condos",
      },
      {
        id: "lifestyle-transformed",
        name: "Lifestyle Transformed",
        description: "Complete all wellness modules",
        category: "wellness_milestone",
        quarter: 4,
        order: 22,
        buildingId: "the-dakota",
      },
      {
        id: "journey-complete",
        name: "Journey Complete",
        description: "Complete your 12-month health transformation",
        category: "quarter_landmark",
        quarter: 4,
        order: 23,
        buildingId: "mushroom-kingdom-castle", // Victory castle!
      },
    ],
  },
];

// Get all milestones in order
export function getAllMilestones(): HealthMilestone[] {
  return DEFAULT_JOURNEY.flatMap(q => q.milestones).sort((a, b) => a.order - b.order);
}

// Get milestone by ID
export function getMilestone(id: string): HealthMilestone | undefined {
  for (const quarter of DEFAULT_JOURNEY) {
    const milestone = quarter.milestones.find(m => m.id === id);
    if (milestone) return milestone;
  }
  return undefined;
}

// Get milestones for a specific quarter
export function getMilestonesByQuarter(quarter: 1 | 2 | 3 | 4): HealthMilestone[] {
  const q = DEFAULT_JOURNEY.find(q => q.id === quarter);
  return q ? q.milestones : [];
}

// Get milestones by category
export function getMilestonesByCategory(category: MilestoneCategory): HealthMilestone[] {
  return getAllMilestones().filter(m => m.category === category);
}

// Calculate grid position for a milestone based on its order
// Creates a winding path through the map
export function calculateMilestonePosition(order: number, gridWidth: number = 48): { x: number; y: number } {
  const SEGMENT_LENGTH = 4; // How many milestones per horizontal segment
  const VERTICAL_SPACING = 8; // Tiles between rows
  const HORIZONTAL_SPACING = 8; // Tiles between milestones
  const MARGIN = 6; // Edge margin
  
  const segment = Math.floor((order - 1) / SEGMENT_LENGTH);
  const positionInSegment = (order - 1) % SEGMENT_LENGTH;
  
  // Alternate direction each segment (snake pattern)
  const goingRight = segment % 2 === 0;
  
  let x: number;
  if (goingRight) {
    x = MARGIN + positionInSegment * HORIZONTAL_SPACING;
  } else {
    x = gridWidth - MARGIN - positionInSegment * HORIZONTAL_SPACING;
  }
  
  // Y position based on segment (start from bottom, go up)
  const y = gridWidth - MARGIN - segment * VERTICAL_SPACING;
  
  return { x, y };
}

// Generate journey path tiles connecting milestones
export function generateJourneyPath(milestones: HealthMilestone[], userProgress: number): Array<{
  x: number;
  y: number;
  completed: boolean;
}> {
  const path: Array<{ x: number; y: number; completed: boolean }> = [];
  
  const completedCount = Math.floor((userProgress / 100) * milestones.length);
  
  for (let i = 0; i < milestones.length; i++) {
    const pos = calculateMilestonePosition(milestones[i].order);
    const completed = i < completedCount;
    
    // Add milestone position
    path.push({ ...pos, completed });
    
    // Add path tiles between milestones
    if (i < milestones.length - 1) {
      const nextPos = calculateMilestonePosition(milestones[i + 1].order);
      // Interpolate between positions
      const steps = Math.max(Math.abs(nextPos.x - pos.x), Math.abs(nextPos.y - pos.y));
      for (let step = 1; step < steps; step++) {
        const t = step / steps;
        const x = Math.round(pos.x + (nextPos.x - pos.x) * t);
        const y = Math.round(pos.y + (nextPos.y - pos.y) * t);
        path.push({ x, y, completed: i < completedCount });
      }
    }
  }
  
  return path;
}

// Category display info
export const MILESTONE_CATEGORY_INFO: Record<MilestoneCategory, {
  name: string;
  icon: string;
  color: string;
}> = {
  weight_milestone: { name: "Weight Loss", icon: "⚖️", color: "#4CAF50" },
  activity_milestone: { name: "Fitness", icon: "💪", color: "#FF9800" },
  nutrition_milestone: { name: "Nutrition", icon: "🥗", color: "#8BC34A" },
  wellness_milestone: { name: "Wellness", icon: "🧘", color: "#9C27B0" },
  quarter_landmark: { name: "Quarterly", icon: "🏆", color: "#FFD700" },
  journey_decoration: { name: "Decoration", icon: "🌳", color: "#795548" },
};
