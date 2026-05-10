// src/services/streak/useStreak.ts

"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  streakService,
} from "./streak.service";

import {
  StreakData,
} from "./streak.types";

export function useStreak() {
  const [streak, setStreak] =
    useState<StreakData>(
      streakService.get()
    );

  useEffect(() => {
    const unsubscribe =
      streakService.subscribe(
        setStreak
      );

    streakService.load();

    return unsubscribe;
  }, []);

  return {
    streak,

    refresh:
      streakService.refresh.bind(
        streakService
      ),
  };
}