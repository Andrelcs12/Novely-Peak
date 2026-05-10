import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma.service";

import { StreakEngine } from "./streak.engine";

import {
  getTodayKey,
  getStartOfDay,
  getEndOfDay,
  isSameDay,
} from "./streak.helpers";

@Injectable()
export class StreakService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // =========================================
  // UPDATE
  // =========================================

  async update(userId: string) {
    const progress =
      await this.calculateDailyProgress(
        userId,
      );

    const streak =
      await this.prisma.streak.findUnique(
        {
          where: { userId },
        },
      );

    // =========================
    // CREATE
    // =========================

    if (!streak) {
      const created =
        await this.prisma.streak.create(
          {
            data: {
              userId,

              current:
                progress.progress >= 70
                  ? 1
                  : 0,

              best:
                progress.progress >= 70
                  ? 1
                  : 0,

              status:
                progress.progress >= 70
                  ? "ACTIVE"
                  : "BROKEN",

              lastCompletedAt:
                progress.progress >= 70
                  ? new Date()
                  : null,
            },
          },
        );

      return created;
    }

    // =========================
    // PROCESS ENGINE
    // =========================

    const result =
      StreakEngine.process({
        current:
          streak.current,

        best: streak.best,

        progress:
          progress.progress,

        alreadyCompletedToday:
          isSameDay(
            streak.lastCompletedAt,
            new Date(),
          ),
      });

    // =========================
    // UPDATE STREAK
    // =========================

    const updated =
      await this.prisma.streak.update(
        {
          where: { userId },

          data: {
            current:
              result.current,

            best: result.best,

            status:
              result.status,

            lastUpdatedAt:
              new Date(),

            lastCompletedAt:
              result.completedToday
                ? new Date()
                : streak.lastCompletedAt,
          },
        },
      );

    // =========================
    // HISTORY
    // =========================

    await this.prisma.streakHistory.upsert(
      {
        where: {
          userId_dateKey: {
            userId,

            dateKey:
              getTodayKey(),
          },
        },

        update: {
          progress:
            progress.progress,

          completed:
            result.completedToday,

          streakAfter:
            result.current,

          status:
            result.status,
        },

        create: {
          userId,

          dateKey:
            getTodayKey(),

          progress:
            progress.progress,

          completed:
            result.completedToday,

          streakAfter:
            result.current,

          status:
            result.status,
        },
      },
    );

    return {
      current: result.current,

      best: result.best,

      status: result.status,

      progress:
        progress.progress,

      incremented:
        result.incremented,

      broken:
        result.broken,
    };
  }

  // =========================================
  // DAILY PROGRESS
  // =========================================

  async calculateDailyProgress(
    userId: string,
  ) {
    const start =
      getStartOfDay();

    const end = getEndOfDay();

    const tasks =
      await this.prisma.task.findMany(
        {
          where: {
            userId,

            archivedAt: null,

            completedAt: {
              gte: start,
              lte: end,
            },
          },
        },
      );

    const completed =
      tasks.filter(
        (task) =>
          task.status === "DONE",
      ).length;

    const total = tasks.length;

    if (!total) {
      return {
        progress: 0,
        total: 0,
        completed: 0,
      };
    }

    const progress =
      Math.round(
        (completed / total) *
          100,
      );

    return {
      progress,
      total,
      completed,
    };
  }

  // =========================================
  // GET
  // =========================================

  async get(userId: string) {
    const streak =
      await this.prisma.streak.findUnique(
        {
          where: { userId },
        },
      );

    if (!streak) {
      return {
        current: 0,
        best: 0,
        status: "BROKEN",
      };
    }

    return streak;
  }

  // =========================================
  // TODAY
  // =========================================

  async getToday(userId: string) {
    const todayKey =
      getTodayKey();

    const history =
      await this.prisma.streakHistory.findUnique(
        {
          where: {
            userId_dateKey: {
              userId,
              dateKey:
                todayKey,
            },
          },
        },
      );

    const progress =
      await this.calculateDailyProgress(
        userId,
      );

    return {
      date: todayKey,

      progress:
        progress.progress,

      completed:
        history?.completed ??
        false,

      status:
        history?.status ??
        "BROKEN",

      streakAfter:
        history?.streakAfter ??
        0,
    };
  }


  // =========================================
// HISTORY
// =========================================

async getHistory(userId: string) {
  const history =
    await this.prisma.streakHistory.findMany(
      {
        where: {
          userId,
        },

        orderBy: {
          dateKey: "asc",
        },
      },
    );

  return history.map((item) => ({
    date: item.dateKey,

    progress:
      item.progress,

    completed:
      item.completed,

    streakAfter:
      item.streakAfter,

    tasksTotal:
      item.tasksTotal,

    tasksCompleted:
      item.tasksCompleted,

    status:
      item.status,
  }));
}


// =========================================
// RESET
// =========================================

async reset(userId: string) {
  const streak =
    await this.prisma.streak.findUnique(
      {
        where: { userId },
      },
    );

  if (!streak) {
    return {
      success: false,
      message:
        "Streak não encontrado",
    };
  }

  const updated =
    await this.prisma.streak.update(
      {
        where: { userId },

        data: {
          current: 0,

          status: "BROKEN",

          frozenDays: 0,

          lastCompletedAt: null,

          lastUpdatedAt:
            new Date(),
        },
      },
    );

  return {
    success: true,

    streak: updated,
  };
}


}