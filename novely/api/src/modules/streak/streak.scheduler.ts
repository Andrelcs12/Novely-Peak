import {
  Injectable,
  Logger,
} from "@nestjs/common";

import {
  Cron,
  CronExpression,
} from "@nestjs/schedule";

import { PrismaService } from "@/prisma.service";

import {
  getTodayKey,
  getYesterdayKey,
  toDayKey,
} from "./streak.helpers";

@Injectable()
export class StreakScheduler {
  private readonly logger =
    new Logger(
      StreakScheduler.name,
    );

  constructor(
    private prisma: PrismaService,
  ) {}

  // ====================================
  // RESET STREAKS AUTOMATICAMENTE
  // ====================================

  @Cron(
    CronExpression.EVERY_DAY_AT_1AM,
  )
  async verifyBrokenStreaks() {
    this.logger.log(
      "Checking broken streaks...",
    );

    const users =
      await this.prisma.streak.findMany();

    const yesterday =
      getYesterdayKey();

    for (const streak of users) {
      if (
        !streak.lastCompletedAt
      ) {
        continue;
      }

      const lastCompletedKey =
        toDayKey(
          streak.lastCompletedAt,
        );

      // usuário não completou ontem
      if (
        lastCompletedKey !==
        yesterday
      ) {
        await this.prisma.streak.update(
          {
            where: {
              userId:
                streak.userId,
            },

            data: {
              current: 0,
              status: "BROKEN",
            },
          },
        );

        await this.prisma.streakHistory.upsert(
          {
            where: {
              userId_dateKey: {
                userId:
                  streak.userId,

                dateKey:
                  getTodayKey(),
              },
            },

            update: {
              status:
                "BROKEN",
            },

            create: {
              userId:
                streak.userId,

              dateKey:
                getTodayKey(),

              progress: 0,

              completed: false,

              streakAfter: 0,

              status:
                "BROKEN",
            },
          },
        );
      }
    }

    this.logger.log(
      "Broken streaks checked.",
    );
  }
}