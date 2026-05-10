import {
  ProcessStreakInput,
  ProcessStreakResult,
  StreakStatus,
} from "./streak.types";

export class StreakEngine {
  static process({
    current,
    best,
    progress,
    alreadyCompletedToday,
  }: ProcessStreakInput): ProcessStreakResult {
    let nextCurrent = current;

    let status: StreakStatus =
      "BROKEN";

    let incremented = false;
    let broken = false;
    let frozen = false;

    const completedToday =
      progress >= 70;

    // =========================
    // ACTIVE
    // =========================

    if (progress >= 70) {
      status = "ACTIVE";

      if (
        !alreadyCompletedToday
      ) {
        nextCurrent =
          current + 1;

        incremented = true;
      }
    }

    // =========================
    // FROZEN
    // =========================

    else if (progress >= 40) {
      status = "FROZEN";

      frozen = true;
    }

    // =========================
    // BROKEN
    // =========================

    else {
      status = "BROKEN";

      nextCurrent = 0;

      broken = true;
    }

    return {
      current: nextCurrent,

      best: Math.max(
        best,
        nextCurrent,
      ),

      status,

      incremented,
      broken,
      frozen,

      completedToday,
    };
  }
}