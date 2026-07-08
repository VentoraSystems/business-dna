export type Difficulty = "low" | "moderate" | "high";

export interface BusinessMatch {
  id: string;
  name: string;
  compatibility: number;
  difficulty: Difficulty;
  investmentMin: number;
  investmentMax: number;
  timeToFirstCustomerWeeks: number;
  scalability: Difficulty;
  automation: Difficulty;
  pros: string[];
  cons: string[];
}

export interface RoadmapTaskItem {
  id: string;
  title: string;
  month: number;
  isDone: boolean;
}

export interface NavItem {
  href: string;
  labelKey: string;
  icon: string;
}
