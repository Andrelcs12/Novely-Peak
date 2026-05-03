import { PrismaService } from "@/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateStreakDto } from "./dto/streak.dto";
import { StreakEventsService } from "../streak-events/streak-events.service";
import { StreakEventType } from "../streak-events/streak-events.types";

@Injectable()
export class StreakService {
  constructor(
    private prisma: PrismaService,
    private streakEvents: StreakEventsService,
  ) {}

  async update(userId: string, dto: UpdateStreakDto) {
    const { progress } = dto;

    const todayKey = this.getTodayKey();

    const streak = await this.prisma.streak.findUnique({
      where: { userId },
    });

    // =========================
    // HISTORY GUARD (1x por dia)
    // =========================
    const alreadyToday = await this.prisma.streakHistory.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(todayKey),
        },
      },
    });

    if (alreadyToday && streak) {
      return this.response(streak, progress, false);
    }

    const status = this.getStatus(progress);

    // =========================
    // FIRST TIME
    // =========================
    if (!streak) {
      const initial = this.buildNextStreak(0, progress);

      const created = await this.prisma.streak.create({
        data: {
          userId,
          current: initial,
          best: initial,
          status,
          lastUpdatedAt: new Date(todayKey),
          lastCompletedAt: progress >= 70 ? new Date(todayKey) : null,
        },
      });

      await this.createHistory(userId, progress, status, todayKey);

      this.emitEvent(userId, initial, status);

      return this.response(created, progress, true);
    }

    // =========================
    // SAME DAY BLOCK
    // =========================
    if (
      streak.lastUpdatedAt &&
      this.toDayKey(streak.lastUpdatedAt) === todayKey
    ) {
      return this.response(streak, progress, false);
    }

    // =========================
    // RULE ENGINE
    // =========================
    const newCurrent = this.buildNextStreak(streak.current, progress);
    const newBest = Math.max(streak.best, newCurrent);

    const updated = await this.prisma.streak.update({
      where: { userId },
      data: {
        current: newCurrent,
        best: newBest,
        status,
        lastUpdatedAt: new Date(todayKey),
        lastCompletedAt:
          progress >= 70 ? new Date(todayKey) : streak.lastCompletedAt,
      },
    });

    await this.createHistory(userId, progress, status, todayKey);

    this.emitEvent(userId, newCurrent, status);

    return this.response(updated, progress, true);
  }

  async get(userId: string) {
  const streak = await this.prisma.streak.findUnique({
    where: { userId },
  });

  if (!streak) {
    return {
      current: 0,
      best: 0,
      status: "ACTIVE",
    };
  }

  return {
    current: streak.current,
    best: streak.best,
    status: streak.status,
  };
}


  async getToday(userId: string) {
  const todayKey = this.getTodayKey();

  const history = await this.prisma.streakHistory.findUnique({
    where: {
      userId_date: {
        userId,
        date: new Date(todayKey),
      },
    },
  });

  const tasksToday = await this.prisma.task.count({
    where: {
      userId,
      createdAt: {
        gte: new Date(todayKey),
      },
    },
  });

  const streak = await this.prisma.streak.findUnique({
    where: { userId },
  });

  return {
    started: tasksToday > 0,   // ✔ CORRETO
    ended: !!history,          // ✔ CORRETO
    canStart: tasksToday > 0 && !history,
    canEnd: tasksToday > 0 && !history,
  };
}


  // =========================
  // RULE ENGINE
  // =========================
  private buildNextStreak(current: number, progress: number) {
    if (progress >= 70) return current + 1;
    if (progress < 40) return 0;
    return current;
  }

  private getStatus(progress: number) {
    if (progress >= 70) return "ACTIVE";
    if (progress >= 40) return "FROZEN";
    return "BROKEN";
  }

  // =========================
  // HISTORY SAFE
  // =========================
  private async createHistory(
    userId: string,
    progress: number,
    status: string,
    dateKey: string,
  ) {
    return this.prisma.streakHistory.create({
      data: {
        userId,
        date: new Date(dateKey),
        progress,
        status,
      },
    });
  }

  // =========================
  // EVENTS
  // =========================
  private emitEvent(userId: string, current: number, status: string) {
    if (status === "ACTIVE") {
      this.streakEvents.emit(StreakEventType.STREAK_UP, {
        userId,
        current,
      });
    }

    if (status === "FROZEN") {
      this.streakEvents.emit(StreakEventType.STREAK_WARNING, {
        userId,
        current,
      });
    }

    if (status === "BROKEN") {
      this.streakEvents.emit(StreakEventType.STREAK_BROKEN, {
        userId,
        current,
      });
    }
  }

  // =========================
  // RESPONSE
  // =========================
  private response(streak, progress: number, updated: boolean) {
    return {
      current: streak.current,
      best: streak.best,
      status: streak.status,
      progress,
      updated,
      message: this.getMessage(progress),
    };
  }

  private getMessage(progress: number) {
    if (progress >= 70) return "Streak mantido 🔥";
    if (progress >= 40) return "Dia estável ⚠️";
    return "Streak quebrado ❌";
  }

  // =========================
  // DATE HELPERS (SAFE UTC)
  // =========================
  private getTodayKey() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  }

  private toDayKey(date: Date) {
    return date.toISOString().slice(0, 10);
  }
}