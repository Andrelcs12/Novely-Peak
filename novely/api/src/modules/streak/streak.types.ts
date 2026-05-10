export type StreakStatus =
  | "ACTIVE"
  | "FROZEN"
  | "BROKEN";

export type ProcessStreakInput = {
  current: number;
  best: number;
  progress: number;
  alreadyCompletedToday: boolean;
};

export type ProcessStreakResult = {
  current: number;
  best: number;
  status: StreakStatus;

  incremented: boolean;
  broken: boolean;
  frozen: boolean;

  completedToday: boolean;
};

export type DailyProgressResult = {
  progress: number;
  total: number;
  completed: number;
};