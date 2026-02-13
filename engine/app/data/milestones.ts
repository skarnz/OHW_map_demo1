// Health Journey Milestones Registry
// 4 Zoom Levels: Quarterly → Monthly → Weekly → Daily

export type ViewLevel = "quarterly" | "monthly" | "weekly" | "daily";

export type NodeCategory =
  | "quarter_milestone"   // Q1-Q4 phase nodes
  | "monthly_education"   // Deep education modules
  | "monthly_goal"        // Monthly goal review
  | "monthly_reflection"  // Monthly reflection
  | "monthly_milestone"   // Monthly celebration
  | "weekly_provider"     // Provider check-in
  | "weekly_weighin"      // Weigh-in & metrics
  | "weekly_medication"   // Medication review
  | "weekly_goal"         // Weekly goal check
  | "weekly_nutrition"    // Nutrition summary
  | "weekly_fitness"      // Fitness summary
  | "weekly_education"    // Bite-sized learning
  | "weekly_reflection"   // Weekly reflection
  | "weekly_milestone"    // Weekly celebration
  | "daily_medication"    // Daily med tracking
  | "daily_nutrition"     // Meal logging
  | "daily_movement"      // Steps/workout
  | "daily_rest"          // Sleep/mood
  | "daily_sleep";        // Evening sleep

export type NodeState = "locked" | "unlocked" | "in_progress" | "completed";

// Environment themes per quarter
export type EnvironmentTheme = "wilderness" | "suburban" | "urban_transition" | "city";

export interface JourneyNode {
  id: string;
  name: string;
  description: string;
  category: NodeCategory;
  icon: string;
  linksTo: string; // Screen/feature it opens
  points: number;
  state?: NodeState;
}

// ============== QUARTERLY VIEW ==============
export interface QuarterNode {
  id: 1 | 2 | 3 | 4;
  name: string;
  title: string;
  description: string;
  months: string;
  environment: EnvironmentTheme;
  visualElements: string[];
  monthlyNodes: MonthNode[];
}

// ============== MONTHLY VIEW ==============
export interface MonthNode {
  month: number; // 1-12
  name: string;
  educationTopic: string;
  nodes: JourneyNode[];
  weeklyNodes: WeekNode[];
}

// ============== WEEKLY VIEW ==============
export interface WeekNode {
  week: number; // 1-4 within month
  nodes: JourneyNode[];
  dailyNodes: DailyNode[];
}

// ============== DAILY VIEW ==============
export interface DailyNode {
  dayOfWeek: number; // 0-6 (Sun-Sat)
  nodes: JourneyNode[];
}

// ============== NODE TEMPLATES ==============

// Weekly node templates (8-9 per week)
const WEEKLY_NODE_TEMPLATES: JourneyNode[] = [
  {
    id: "provider-checkin",
    name: "Provider Check-In",
    description: "Weekly check-in with care team",
    category: "weekly_provider",
    icon: "📋",
    linksTo: "messaging",
    points: 50,
  },
  {
    id: "weighin-metrics",
    name: "Weigh-In & Metrics",
    description: "Weekly body composition check",
    category: "weekly_weighin",
    icon: "⚖️",
    linksTo: "weight-log",
    points: 50,
  },
  {
    id: "medication-review",
    name: "Medication Review",
    description: "Weekly dose check & side effects",
    category: "weekly_medication",
    icon: "💊",
    linksTo: "medication-tracker",
    points: 50,
  },
  {
    id: "weekly-goal-check",
    name: "Weekly Goal Check",
    description: "Review SMART goal progress",
    category: "weekly_goal",
    icon: "🎯",
    linksTo: "goal-progress",
    points: 50,
  },
  {
    id: "nutrition-summary",
    name: "Nutrition Summary",
    description: "Week's calorie/macro averages",
    category: "weekly_nutrition",
    icon: "📊",
    linksTo: "nutrition-breakdown",
    points: 50,
  },
  {
    id: "fitness-summary",
    name: "Fitness Summary",
    description: "Total workouts, steps, active minutes",
    category: "weekly_fitness",
    icon: "🏋️",
    linksTo: "activity-log",
    points: 50,
  },
  {
    id: "weekly-education",
    name: "Education Module",
    description: "Bite-sized learning (5-10 min)",
    category: "weekly_education",
    icon: "📚",
    linksTo: "learning-library",
    points: 50,
  },
  {
    id: "weekly-reflection",
    name: "Weekly Reflection",
    description: "Mood/stress patterns, wins & challenges",
    category: "weekly_reflection",
    icon: "📝",
    linksTo: "reflection-prompts",
    points: 50,
  },
  {
    id: "weekly-milestone",
    name: "Weekly Milestone",
    description: "Celebrate completing the week",
    category: "weekly_milestone",
    icon: "⭐",
    linksTo: "celebration",
    points: 100,
  },
];

// Daily node templates (4-5 per day)
const DAILY_NODE_TEMPLATES: JourneyNode[] = [
  {
    id: "daily-medication",
    name: "Medication",
    description: "Did you take your meds today?",
    category: "daily_medication",
    icon: "💊",
    linksTo: "medication-tracker",
    points: 10,
  },
  {
    id: "daily-nutrition",
    name: "Nutrition",
    description: "Log meals, track hydration",
    category: "daily_nutrition",
    icon: "🍎",
    linksTo: "food-logger",
    points: 10,
  },
  {
    id: "daily-movement",
    name: "Movement",
    description: "Steps, workout, active minutes",
    category: "daily_movement",
    icon: "🏃",
    linksTo: "activity-tracker",
    points: 10,
  },
  {
    id: "daily-rest",
    name: "Rest & Mood",
    description: "Sleep log, stress/mood check-in",
    category: "daily_rest",
    icon: "😊",
    linksTo: "mood-tracker",
    points: 10,
  },
  {
    id: "daily-sleep",
    name: "Sleep",
    description: "Evening prompt: Time to rest",
    category: "daily_sleep",
    icon: "🛏️",
    linksTo: "sleep-reminder",
    points: 10,
  },
];

// Monthly education topics by quarter
const MONTHLY_EDUCATION: Record<number, string> = {
  1: "Personalized Weight Loss Plan Review",
  2: "Early Challenges & AI Guidance",
  3: "Habit Stacking Mastery",
  4: "Macronutrient Balance Review",
  5: "Alcohol Moderation Strategies",
  6: "Intermittent Fasting Deep Dive",
  7: "Psychological Effects of Fasting",
  8: "Stress, Cortisol & Weight Loss",
  9: "Body Composition: Fat vs. Muscle",
  10: "Building Lasting Habits",
  11: "Utilizing Support Groups & Resources",
  12: "Full Journey Review & Maintenance Planning",
};

// Weekly education topics by quarter
const WEEKLY_EDUCATION_BY_QUARTER: Record<1 | 2 | 3 | 4, string[]> = {
  1: [
    "Defining Your Why & Goals",
    "Understanding Starting Point",
    "Tailoring Strategies to Lifestyle",
    "Identifying Barriers",
  ],
  2: [
    "Balanced Meals & Sustainable Swaps",
    "Hunger/Fullness Cues",
    "Fasting Basics & Metabolism",
    "Nutrition Tracking Tips",
  ],
  3: [
    "Plateau-Breaking Techniques",
    "Stress & Cortisol Effects",
    "Reassessing Goals",
    "Mental Health Check-Ins",
  ],
  4: [
    "Creating Lasting Habits",
    "Group/Resource Utilization",
    "Milestone Celebrations",
    "Ongoing Motivation",
  ],
};

// ============== GENERATE FULL JOURNEY STRUCTURE ==============

function generateMonthNodes(month: number, quarter: 1 | 2 | 3 | 4): MonthNode {
  const educationTopic = MONTHLY_EDUCATION[month];
  
  // Monthly nodes (3-4 per month)
  const nodes: JourneyNode[] = [
    {
      id: `month-${month}-education`,
      name: "Deep Education Module",
      description: educationTopic,
      category: "monthly_education",
      icon: "🎓",
      linksTo: "learning-library",
      points: 100,
    },
    {
      id: `month-${month}-goal-review`,
      name: "Monthly Goal Review",
      description: "Big-picture goal check",
      category: "monthly_goal",
      icon: "🎯",
      linksTo: "goal-summary",
      points: 100,
    },
    {
      id: `month-${month}-reflection`,
      name: "Monthly Reflection",
      description: "Month-level wins, challenges, patterns",
      category: "monthly_reflection",
      icon: "📔",
      linksTo: "reflection-prompts",
      points: 100,
    },
    {
      id: `month-${month}-milestone`,
      name: "Monthly Milestone",
      description: "Points bonus, badge unlock",
      category: "monthly_milestone",
      icon: "🏆",
      linksTo: "celebration",
      points: 200,
    },
  ];

  // Generate 4 weeks for this month
  const weeklyNodes: WeekNode[] = [1, 2, 3, 4].map(week => generateWeekNode(month, week, quarter));

  return {
    month,
    name: `Month ${month}`,
    educationTopic,
    nodes,
    weeklyNodes,
  };
}

function generateWeekNode(month: number, week: number, quarter: 1 | 2 | 3 | 4): WeekNode {
  const weekTopics = WEEKLY_EDUCATION_BY_QUARTER[quarter];
  const weekIndex = (week - 1) % weekTopics.length;
  
  // Clone templates and customize IDs
  const nodes: JourneyNode[] = WEEKLY_NODE_TEMPLATES.map(template => ({
    ...template,
    id: `month-${month}-week-${week}-${template.id}`,
    description: template.category === "weekly_education" 
      ? weekTopics[weekIndex] 
      : template.description,
  }));

  // Generate 7 days for this week
  const dailyNodes: DailyNode[] = [0, 1, 2, 3, 4, 5, 6].map(day => generateDailyNode(month, week, day));

  return {
    week,
    nodes,
    dailyNodes,
  };
}

function generateDailyNode(month: number, week: number, dayOfWeek: number): DailyNode {
  // Clone templates and customize IDs
  const nodes: JourneyNode[] = DAILY_NODE_TEMPLATES.map(template => ({
    ...template,
    id: `month-${month}-week-${week}-day-${dayOfWeek}-${template.id}`,
  }));

  return {
    dayOfWeek,
    nodes,
  };
}

// ============== MAIN JOURNEY DATA ==============

export const JOURNEY_MAP: QuarterNode[] = [
  {
    id: 1,
    name: "Q1",
    title: "Foundation",
    description: "Setting intentions, assessing habits, creating plans",
    months: "Months 1-3",
    environment: "wilderness",
    visualElements: ["Log cabin", "Lake", "Rowboat", "Dense forest", "Trails"],
    monthlyNodes: [1, 2, 3].map(m => generateMonthNodes(m, 1)),
  },
  {
    id: 2,
    name: "Q2",
    title: "Momentum",
    description: "Nutrition focus, hunger cues, metabolic health",
    months: "Months 4-6",
    environment: "suburban",
    visualElements: ["Community center", "Fountain", "Park benches", "Bikes", "Scooters"],
    monthlyNodes: [4, 5, 6].map(m => generateMonthNodes(m, 2)),
  },
  {
    id: 3,
    name: "Q3",
    title: "Optimization",
    description: "Overcoming plateaus, stress, body composition",
    months: "Months 7-9",
    environment: "urban_transition",
    visualElements: ["Mixed residential", "Garden beds", "Solar panels", "Small buildings"],
    monthlyNodes: [7, 8, 9].map(m => generateMonthNodes(m, 3)),
  },
  {
    id: 4,
    name: "Q4",
    title: "Sustainability",
    description: "Long-term habits, celebration, maintenance",
    months: "Months 10-12",
    environment: "city",
    visualElements: ["Glowing skyline", "Modern buildings", "Healthy urban life"],
    monthlyNodes: [10, 11, 12].map(m => generateMonthNodes(m, 4)),
  },
];

// ============== HELPER FUNCTIONS ==============

// Get quarter by ID
export function getQuarter(id: 1 | 2 | 3 | 4): QuarterNode | undefined {
  return JOURNEY_MAP.find(q => q.id === id);
}

// Get month data
export function getMonth(month: number): MonthNode | undefined {
  for (const quarter of JOURNEY_MAP) {
    const monthNode = quarter.monthlyNodes.find(m => m.month === month);
    if (monthNode) return monthNode;
  }
  return undefined;
}

// Get quarter for a month
export function getQuarterForMonth(month: number): 1 | 2 | 3 | 4 {
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
}

// Get all nodes at a specific view level
export function getNodesForView(
  level: ViewLevel,
  context?: { quarter?: 1 | 2 | 3 | 4; month?: number; week?: number }
): JourneyNode[] {
  switch (level) {
    case "quarterly":
      return JOURNEY_MAP.map(q => ({
        id: `quarter-${q.id}`,
        name: q.name,
        description: q.description,
        category: "quarter_milestone" as NodeCategory,
        icon: q.id === 1 ? "🏠" : q.id === 2 ? "🏃" : q.id === 3 ? "🎯" : "🏆",
        linksTo: "monthly-view",
        points: 500,
      }));

    case "monthly":
      if (!context?.quarter) return [];
      const quarter = getQuarter(context.quarter);
      return quarter?.monthlyNodes.flatMap(m => m.nodes) || [];

    case "weekly":
      if (!context?.month) return [];
      const monthData = getMonth(context.month);
      if (!context?.week) return monthData?.weeklyNodes.flatMap(w => w.nodes) || [];
      const weekData = monthData?.weeklyNodes.find(w => w.week === context.week);
      return weekData?.nodes || [];

    case "daily":
      if (!context?.month || !context?.week) return [];
      const monthForDaily = getMonth(context.month);
      const weekForDaily = monthForDaily?.weeklyNodes.find(w => w.week === context.week);
      return weekForDaily?.dailyNodes.flatMap(d => d.nodes) || [];
  }
}

// Calculate node position on grid based on view level
export function calculateNodePosition(
  nodeIndex: number,
  totalNodes: number,
  viewLevel: ViewLevel,
  gridWidth: number = 48
): { x: number; y: number } {
  const centerX = gridWidth / 2;
  const centerY = gridWidth / 2;
  
  switch (viewLevel) {
    case "quarterly":
      // 4 nodes in a winding path
      const quarterPositions = [
        { x: 12, y: 38 },  // Q1 - bottom left (wilderness)
        { x: 32, y: 32 },  // Q2 - right (suburban)
        { x: 12, y: 20 },  // Q3 - left (urban transition)
        { x: 32, y: 8 },   // Q4 - top right (city)
      ];
      return quarterPositions[nodeIndex] || { x: centerX, y: centerY };

    case "monthly":
      // 3-4 nodes per month, horizontal spread
      const monthSpacing = 10;
      return {
        x: 10 + (nodeIndex * monthSpacing),
        y: centerY,
      };

    case "weekly":
      // 8-9 nodes in a winding path
      const weeklyPerRow = 3;
      const row = Math.floor(nodeIndex / weeklyPerRow);
      const col = nodeIndex % weeklyPerRow;
      const goingRight = row % 2 === 0;
      return {
        x: goingRight ? 10 + (col * 12) : 34 - (col * 12),
        y: 36 - (row * 8),
      };

    case "daily":
      // 4-5 nodes in short path
      return {
        x: 14 + (nodeIndex * 6),
        y: centerY + (nodeIndex % 2 === 0 ? -2 : 2),
      };
  }
}

// Node category info for display
export const NODE_CATEGORY_INFO: Record<NodeCategory, {
  name: string;
  icon: string;
  color: string;
  viewLevel: ViewLevel;
}> = {
  quarter_milestone: { name: "Quarter", icon: "🏆", color: "#FFD700", viewLevel: "quarterly" },
  monthly_education: { name: "Education", icon: "🎓", color: "#9C27B0", viewLevel: "monthly" },
  monthly_goal: { name: "Goal Review", icon: "🎯", color: "#2196F3", viewLevel: "monthly" },
  monthly_reflection: { name: "Reflection", icon: "📔", color: "#607D8B", viewLevel: "monthly" },
  monthly_milestone: { name: "Milestone", icon: "🏆", color: "#FFD700", viewLevel: "monthly" },
  weekly_provider: { name: "Provider", icon: "📋", color: "#00BCD4", viewLevel: "weekly" },
  weekly_weighin: { name: "Weigh-In", icon: "⚖️", color: "#4CAF50", viewLevel: "weekly" },
  weekly_medication: { name: "Medication", icon: "💊", color: "#E91E63", viewLevel: "weekly" },
  weekly_goal: { name: "Goal Check", icon: "🎯", color: "#2196F3", viewLevel: "weekly" },
  weekly_nutrition: { name: "Nutrition", icon: "📊", color: "#8BC34A", viewLevel: "weekly" },
  weekly_fitness: { name: "Fitness", icon: "🏋️", color: "#FF9800", viewLevel: "weekly" },
  weekly_education: { name: "Education", icon: "📚", color: "#9C27B0", viewLevel: "weekly" },
  weekly_reflection: { name: "Reflection", icon: "📝", color: "#607D8B", viewLevel: "weekly" },
  weekly_milestone: { name: "Milestone", icon: "⭐", color: "#FFD700", viewLevel: "weekly" },
  daily_medication: { name: "Medication", icon: "💊", color: "#E91E63", viewLevel: "daily" },
  daily_nutrition: { name: "Nutrition", icon: "🍎", color: "#8BC34A", viewLevel: "daily" },
  daily_movement: { name: "Movement", icon: "🏃", color: "#FF9800", viewLevel: "daily" },
  daily_rest: { name: "Rest", icon: "😊", color: "#9C27B0", viewLevel: "daily" },
  daily_sleep: { name: "Sleep", icon: "🛏️", color: "#3F51B5", viewLevel: "daily" },
};

// Points system
export const POINTS_CONFIG = {
  dailyNode: 10,
  weeklyMilestone: 50,
  monthlyMilestone: 100,
  quarterlyMilestone: 500,
  streakBonus7Day: 100,
  streakBonus30Day: 300,
  streakBonus90Day: 1000,
};

// ============== LEGACY COMPATIBILITY ==============
// Keep old types for backward compatibility during migration

export type MilestoneCategory = NodeCategory;

export interface HealthMilestone {
  id: string;
  name: string;
  description: string;
  category: NodeCategory;
  quarter: 1 | 2 | 3 | 4;
  order: number;
  targetValue?: number;
  unit?: string;
  buildingId: string;
  unlockCondition?: string;
}

export interface JourneyQuarter {
  id: number;
  name: string;
  title: string;
  description: string;
  months: string;
  milestones: HealthMilestone[];
}

// Demo journey with existing buildings - winding path from wilderness to city
// Path flows: bottom-left → right → up-left → right → up-left → right (snake pattern)
export const DEFAULT_JOURNEY: JourneyQuarter[] = [
  {
    id: 1,
    name: "Q1",
    title: "Foundation",
    description: "Setting intentions, assessing habits, creating plans",
    months: "Months 1-3",
    milestones: [
      // Row 1 (bottom) - Wilderness/Cabin area - Y=38
      { id: "journey-start", name: "Journey Begins", description: "Your health journey starts here", category: "quarter_milestone", quarter: 1, order: 1, buildingId: "christmas-cottage" },
      { id: "first-weigh-in", name: "First Weigh-In", description: "Record starting weight", category: "weekly_weighin", quarter: 1, order: 2, buildingId: "fountain" },
      { id: "first-meal", name: "First Meal Logged", description: "Log your first meal", category: "daily_nutrition", quarter: 1, order: 3, buildingId: "flower-bush" },
      // Row 2 - Y=32
      { id: "week-1-complete", name: "Week 1 Complete", description: "First week done!", category: "weekly_milestone", quarter: 1, order: 4, buildingId: "tree-1" },
      { id: "provider-checkin-1", name: "Provider Check-In", description: "Meet your care team", category: "weekly_provider", quarter: 1, order: 5, buildingId: "park-table" },
      { id: "education-1", name: "Defining Your Why", description: "Deep education module", category: "monthly_education", quarter: 1, order: 6, buildingId: "bookstore" },
    ],
  },
  {
    id: 2,
    name: "Q2",
    title: "Momentum",
    description: "Nutrition focus, hunger cues, metabolic health",
    months: "Months 4-6",
    milestones: [
      // Row 3 - Suburban/Town area - Y=26
      { id: "month-1-complete", name: "Month 1 Complete", description: "First month milestone", category: "monthly_milestone", quarter: 2, order: 7, buildingId: "christmas-clock-tower" },
      { id: "5lb-lost", name: "5 Pounds Lost", description: "First weight milestone!", category: "weekly_weighin", quarter: 2, order: 8, buildingId: "yellow-apartments" },
      { id: "streak-7", name: "7-Day Streak", description: "One week of logging", category: "weekly_milestone", quarter: 2, order: 9, buildingId: "english-townhouse" },
      // Row 4 - Y=20
      { id: "nutrition-focus", name: "Nutrition Mastery", description: "Balanced meals module", category: "monthly_education", quarter: 2, order: 10, buildingId: "brownstone" },
      { id: "10lb-lost", name: "10 Pounds Lost", description: "Double digits!", category: "weekly_weighin", quarter: 2, order: 11, buildingId: "limestone" },
      { id: "q2-complete", name: "Q2 Complete", description: "Halfway there!", category: "quarter_milestone", quarter: 2, order: 12, buildingId: "church" },
    ],
  },
  {
    id: 3,
    name: "Q3",
    title: "Optimization",
    description: "Overcoming plateaus, stress, body composition",
    months: "Months 7-9",
    milestones: [
      // Row 5 - Urban transition - Y=14
      { id: "fitness-focus", name: "Fitness Level Up", description: "Increase intensity", category: "weekly_fitness", quarter: 3, order: 13, buildingId: "80s-apartment" },
      { id: "15lb-lost", name: "15 Pounds Lost", description: "Amazing progress!", category: "weekly_weighin", quarter: 3, order: 14, buildingId: "row-houses" },
      { id: "streak-30", name: "30-Day Streak", description: "One month dedication", category: "weekly_milestone", quarter: 3, order: 15, buildingId: "medium-apartments" },
      // Row 6 - Y=8
      { id: "20lb-lost", name: "20 Pounds Lost", description: "Major milestone!", category: "weekly_weighin", quarter: 3, order: 16, buildingId: "leafy-apartments" },
      { id: "stress-mastery", name: "Stress Management", description: "Cortisol & weight", category: "monthly_education", quarter: 3, order: 17, buildingId: "gothic-apartments" },
      { id: "q3-complete", name: "Q3 Complete", description: "Final stretch!", category: "quarter_milestone", quarter: 3, order: 18, buildingId: "large-apartments-20s" },
    ],
  },
  {
    id: 4,
    name: "Q4",
    title: "Sustainability",
    description: "Long-term habits, celebration, maintenance",
    months: "Months 10-12",
    milestones: [
      // Row 7 - City skyline - Y=2
      { id: "25lb-lost", name: "25 Pounds Lost", description: "Incredible achievement!", category: "weekly_weighin", quarter: 4, order: 19, buildingId: "the-dakota" },
      { id: "streak-90", name: "90-Day Streak", description: "Three months strong", category: "weekly_milestone", quarter: 4, order: 20, buildingId: "modern-terra-condos" },
      { id: "goal-weight", name: "Goal Weight", description: "You made it!", category: "weekly_weighin", quarter: 4, order: 21, buildingId: "large-apartments-60s" },
      { id: "journey-complete", name: "Journey Complete", description: "Health transformation achieved!", category: "quarter_milestone", quarter: 4, order: 22, buildingId: "mushroom-kingdom-castle" },
    ],
  },
];

export function getAllMilestones(): HealthMilestone[] {
  return DEFAULT_JOURNEY.flatMap(q => q.milestones).sort((a, b) => a.order - b.order);
}

export function getMilestone(id: string): HealthMilestone | undefined {
  return getAllMilestones().find(m => m.id === id);
}

export function getMilestonesByQuarter(quarter: 1 | 2 | 3 | 4): HealthMilestone[] {
  const q = DEFAULT_JOURNEY.find(q => q.id === quarter);
  return q ? q.milestones : [];
}

// Journey path positions - snake pattern from bottom-left to top-right
export function calculateMilestonePosition(order: number, gridWidth: number = 48): { x: number; y: number } {
  const MILESTONES_PER_ROW = 3;
  const HORIZONTAL_SPACING = 10;
  const VERTICAL_SPACING = 6;
  const START_X = 10;
  const START_Y = 38;
  
  const row = Math.floor((order - 1) / MILESTONES_PER_ROW);
  const col = (order - 1) % MILESTONES_PER_ROW;
  
  // Snake pattern: even rows go right, odd rows go left
  const goingRight = row % 2 === 0;
  const x = goingRight 
    ? START_X + (col * HORIZONTAL_SPACING)
    : START_X + ((MILESTONES_PER_ROW - 1 - col) * HORIZONTAL_SPACING);
  
  const y = START_Y - (row * VERTICAL_SPACING);
  
  return { 
    x: Math.max(2, Math.min(x, gridWidth - 6)), 
    y: Math.max(2, Math.min(y, gridWidth - 2)) 
  };
}

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
    
    path.push({ ...pos, completed });
    
    // Add interpolated path tiles between milestones
    if (i < milestones.length - 1) {
      const nextPos = calculateMilestonePosition(milestones[i + 1].order);
      const dx = nextPos.x - pos.x;
      const dy = nextPos.y - pos.y;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      
      for (let step = 1; step < steps; step++) {
        const t = step / steps;
        path.push({
          x: Math.round(pos.x + dx * t),
          y: Math.round(pos.y + dy * t),
          completed: i < completedCount,
        });
      }
    }
  }
  
  return path;
}

export const MILESTONE_CATEGORY_INFO = NODE_CATEGORY_INFO;
