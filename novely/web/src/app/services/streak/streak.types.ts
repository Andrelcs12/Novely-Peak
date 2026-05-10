// src/services/streak/streak.types.ts

export type StreakStatus =
  | "ACTIVE"
  | "BROKEN"
  | "FROZEN";

export type StreakData = {
  current: number;
  best: number;
  status: StreakStatus;
};