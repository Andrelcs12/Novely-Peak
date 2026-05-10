import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  CompleteOnboardingDto,
  UpdateProfileDto,
} from "./dto/user.dto";

import { PrismaService } from "@/prisma.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // =========================================
  // COMPLETE INTRO
  // =========================================

  async completeOnboardingIntro(
    userId: string,
  ) {
    const user =
      await this.prisma.user.findUnique(
        {
          where: {
            id: userId,
          },
        },
      );

    if (!user) {
      throw new NotFoundException(
        "Usuário não encontrado",
      );
    }

    if (user.onboardingIntroDone) {
      return user;
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        onboardingIntroDone: true,
      },
    });
  }

  // =========================================
  // COMPLETE ONBOARDING
  // =========================================

  async completeOnboarding(
    userId: string,
    data: CompleteOnboardingDto,
  ) {
    const user =
      await this.prisma.user.findUnique(
        {
          where: {
            id: userId,
          },
        },
      );

    if (!user) {
      throw new NotFoundException(
        "Usuário não encontrado",
      );
    }

    if (user.onboardingDone) {
      return user;
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        goal: data.goal,
        workStyle:
          data.workStyle,
        discipline:
          data.discipline,

        onboardingIntroDone:
          true,

        onboardingDone:
          true,

        onboardingCompletedAt:
          new Date(),
      },
    });
  }

  // =========================================
  // PROFILE
  // =========================================

  async getProfile(
    userId: string,
  ) {
    const user =
      await this.prisma.user.findUnique(
        {
          where: {
            id: userId,
          },

          include: {
            streak: true,

            tasks: {
              where: {
                status: "DONE",
              },
            },

            goals: {
              where: {
                status:
                  "COMPLETED",
              },
            },

            streakHistory: {
              orderBy: {
                dateKey: "asc",
              },

              take: 90,
            },
          },
        },
      );

    if (!user) {
      throw new NotFoundException(
        "Usuário não encontrado",
      );
    }

    const completedTasks =
      user.tasks.length;

    const completedGoals =
      user.goals.length;

    return {
      id: user.id,

      name: user.name,

      username:
        user.username,

      email: user.email,

      avatar: user.avatar,

      timezone:
        user.timezone,

      plan: "FREE",

      streak: {
        current:
          user.streak
            ?.current ?? 0,

        best:
          user.streak?.best ??
          0,

        status:
          user.streak
            ?.status ??
          "BROKEN",
      },

      stats: {
        completedTasks,

        completedGoals,

        productivity:
          completedTasks > 0
            ? Math.min(
                100,
                Math.round(
                  (completedTasks /
                    30) *
                    100,
                ),
              )
            : 0,

        activeDays:
          user.streakHistory
            .length,
      },

      heatmap:
        user.streakHistory.map(
          (item) => ({
            date:
              item.dateKey,

            count:
              item.progress ??
              0,

            completed:
              item.completed,

            streakAfter:
              item.streakAfter,
          }),
        ),
    };
  }

  // =========================================
  // UPDATE PROFILE
  // =========================================

  async updateProfile(
    userId: string,
    data: UpdateProfileDto,
  ) {
    if (data.username) {
      const usernameExists =
        await this.prisma.user.findFirst(
          {
            where: {
              username:
                data.username.toLowerCase(),

              NOT: {
                id: userId,
              },
            },
          },
        );

      if (usernameExists) {
        throw new BadRequestException(
          "Username já está em uso",
        );
      }
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        name: data.name,

        username:
          data.username?.toLowerCase(),
      },
    });
  }
}