import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "@/prisma.service";

import { TaskDto } from "./dto/task.dto";

import { TaskStatus } from "../../../generated/prisma/enums";

import { GoalsService } from "../goals/goals.service";
import { StreakService } from "../streak/streak.service";

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private goalsService: GoalsService,
    private streakService: StreakService,
  ) {}

  // =========================
  // LIST
  // =========================

  async findAll(
    userId: string,
    period?: string,
  ) {
    const where: any = {
      userId,
      archivedAt: null,
    };

    const now = new Date();

    // =========================
    // TODAY
    // =========================

    if (period === "today") {
      const start = new Date();

      start.setHours(
        0,
        0,
        0,
        0,
      );

      const end = new Date();

      end.setHours(
        23,
        59,
        59,
        999,
      );

      where.OR = [
        {
          createdAt: {
            gte: start,
            lte: end,
          },
        },

        {
          dueDate: {
            gte: start,
            lte: end,
          },
        },
      ];
    }

    // =========================
    // LAST 7 DAYS
    // =========================

    if (period === "7d") {
      const start = new Date();

      start.setDate(
        start.getDate() - 7,
      );

      where.completedAt = {
        gte: start,
        lte: now,
      };

      where.status = "DONE";
    }

    // =========================
    // OVERDUE
    // =========================

    if (period === "overdue") {
      where.dueDate = {
        lt: now,
      };

      where.status = {
        not: "DONE",
      };
    }

    return this.prisma.task.findMany(
      {
        where,

        orderBy: [
          {
            status: "asc",
          },

          {
            priority:
              "desc",
          },

          {
            createdAt:
              "desc",
          },
        ],
      },
    );
  }

  // =========================
  // FIND ONE
  // =========================

  async findOne(
    id: string,
    userId: string,
  ) {
    const task =
      await this.prisma.task.findFirst(
        {
          where: {
            id,
            userId,
          },
        },
      );

    if (!task) {
      throw new NotFoundException(
        "Task não encontrada",
      );
    }

    return task;
  }

  // =========================
  // TOGGLE STATUS
  // =========================

  async toggleStatus(
    id: string,
    userId: string,
    status: TaskStatus,
  ) {
    await this.ensureOwnership(
      id,
      userId,
    );

    // =========================
    // UPDATE TASK
    // =========================

    const task =
      await this.prisma.task.update(
        {
          where: { id },

          data: {
            status,

            completedAt:
              status ===
              TaskStatus.DONE
                ? new Date()
                : null,

            ...(status ===
              TaskStatus.IN_PROGRESS && {
              startedAt:
                new Date(),
            }),
          },
        },
      );

    // =========================
    // RECALC GOAL
    // =========================

    if (task.goalId) {
      await this.goalsService.recalcGoalProgress(
        task.goalId,
      );
    }

    // =========================
    // UPDATE STREAK
    // =========================

    await this.streakService.update(
      userId,
    );

    return task;
  }

  // =========================
  // CREATE
  // =========================

  async create(
    userId: string,
    data: TaskDto,
  ) {
    this.validateTaskInput(
      data,
    );

    return this.prisma.task.create(
      {
        data: {
          title:
            data.title?.trim(),

          description:
            data.description ??
            null,

          status:
            data.status ??
            TaskStatus.TODO,

          priority:
            data.priority ??
            "MEDIUM",

          dueDate:
            data.dueDate ??
            null,

          estimatedTime:
            data.estimatedTime ??
            null,

          energyLevel:
            data.energyLevel ??
            null,

          category:
            data.category ??
            null,

          isRecurring:
            data.isRecurring ??
            false,

          recurrenceRule:
            data.recurrenceRule ??
            null,

          startedAt: null,

          completedAt:
            null,

          archivedAt:
            null,

          source:
            data.source ??
            "manual",

          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    );
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    id: string,
    userId: string,
    data: TaskDto,
  ) {
    await this.ensureOwnership(
      id,
      userId,
    );

    this.validateTaskInput(
      data,
    );

    return this.prisma.task.update(
      {
        where: { id },

        data: {
          title:
            data.title?.trim(),

          description:
            data.description,

          priority:
            data.priority,

          dueDate:
            data.dueDate,

          estimatedTime:
            data.estimatedTime,

          energyLevel:
            data.energyLevel,

          category:
            data.category,

          isRecurring:
            data.isRecurring,

          recurrenceRule:
            data.recurrenceRule,

          updatedAt:
            new Date(),
        },
      },
    );
  }

  // =========================
  // DELETE
  // =========================

  async remove(
    id: string,
    userId: string,
  ) {
    await this.ensureOwnership(
      id,
      userId,
    );

    return this.prisma.task.update(
      {
        where: { id },

        data: {
          archivedAt:
            new Date(),
        },
      },
    );
  }

  // =========================
  // VALIDATION
  // =========================

  private validateTaskInput(
    data: TaskDto,
  ) {
    // =========================
    // TITLE
    // =========================

    if (
      data.title !== undefined
    ) {
      if (
        !data.title ||
        data.title.trim()
          .length < 3
      ) {
        throw new BadRequestException(
          "Título muito curto",
        );
      }

      if (
        data.title.length >
        120
      ) {
        throw new BadRequestException(
          "Título muito longo",
        );
      }
    }

    // =========================
    // ESTIMATED TIME
    // =========================

    if (
      data.estimatedTime !==
        undefined &&
      data.estimatedTime !==
        null
    ) {
      if (
        data.estimatedTime <
          1 ||
        data.estimatedTime >
          600
      ) {
        throw new BadRequestException(
          "Tempo estimado inválido (1–600 min)",
        );
      }
    }

    // =========================
    // ENERGY LEVEL
    // =========================

    if (
      data.energyLevel !==
        undefined &&
      data.energyLevel !==
        null
    ) {
      if (
        data.energyLevel <
          1 ||
        data.energyLevel >
          5
      ) {
        throw new BadRequestException(
          "Energy level deve ser entre 1 e 5",
        );
      }
    }

    // =========================
    // DUE DATE
    // =========================

    if (
      data.dueDate &&
      new Date(
        data.dueDate,
      ) <
        new Date(
          "2020-01-01",
        )
    ) {
      throw new BadRequestException(
        "Data inválida",
      );
    }
  }

  // =========================
  // OWNERSHIP CHECK
  // =========================

  private async ensureOwnership(
    id: string,
    userId: string,
  ) {
    const task =
      await this.prisma.task.findFirst(
        {
          where: {
            id,
            userId,
          },

          select: {
            id: true,
          },
        },
      );

    if (!task) {
      throw new NotFoundException(
        "Task não encontrada",
      );
    }
  }
}