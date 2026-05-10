// types/profile.ts

export type HeatmapDay = {
  date: string;
  count: number;
};

export type UserPlan =
  | "FREE"
  | "PRO";

export type UserStreak = {
  current: number;
  best: number;
};

export type ProfileStats = {
  completedTasks: number;
  completedGoals: number;
  productivity: number;
  activeDays: number;
};

export type ProfileData = {
  id: string;

  name: string | null;
  username: string | null;
  email: string;

  avatar?: string | null;

  plan?: UserPlan;

  streak?: UserStreak | null;

  stats: ProfileStats;

  heatmap: HeatmapDay[];
};