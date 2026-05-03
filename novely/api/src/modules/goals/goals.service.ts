import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { GoalDto } from './dto/goals.dto';
import { GoalStatus } from '../../../generated/prisma/enums';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // LIST
  // =========================
  async findAll(userId: string) {
    return this.prisma.goal.findMany({
      where: {
        userId,
        archivedAt: null,
      },
      include: {
        tasks: true,
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: string, userId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId, archivedAt: null },
      include: { tasks: true },
    });

    if (!goal) {
      throw new NotFoundException('Meta não encontrada');
    }

    return goal;
  }

  async create(userId: string, data: GoalDto) {
  this.validateCreate(data);

  return this.prisma.goal.create({
    data: {
      title: data.title!.trim(),
      description: data.description ?? null,

      status: GoalStatus.ACTIVE,
      priority: data.priority ?? 'MEDIUM',
      progress: 0,

      dueDate: data.dueDate ? new Date(data.dueDate) : null,

      category: data.category ?? null,
      color: data.color ?? null,
      icon: data.icon ?? null,

      user: {
        connect: { id: userId },
      },

      tasks: data.tasks?.length
        ? {
            create: data.tasks.map((t) => ({
              title: t.title,
              description: t.description ?? null,
              status: t.status ?? 'TODO',
              priority: t.priority ?? 'MEDIUM',
              dueDate: t.dueDate ? new Date(t.dueDate) : null,

              // 🔥 CORREÇÃO PRINCIPAL
              user: {
                connect: { id: userId },
              },
            })),
          }
        : undefined,
    },
    include: { tasks: true },
  });
}


  // =========================
  // UPDATE (COM TASKS)
  // =========================
  async update(id: string, userId: string, data: GoalDto) {
    await this.ensureOwnership(id, userId);
    this.validateUpdate(data);

    return this.prisma.$transaction(async (tx) => {
      // 1. Atualiza meta
      await tx.goal.update({
        where: { id },
        data: {
          title: data.title?.trim(),
          description: data.description ?? undefined,
          priority: data.priority ?? undefined,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          category: data.category ?? undefined,
          color: data.color ?? undefined,
          icon: data.icon ?? undefined,
        },
      });

      // 2. Atualiza tasks corretamente
      if (data.tasks) {
        // remove tasks antigas dessa meta
        await tx.task.deleteMany({
          where: { goalId: id },
        });

        // recria vinculadas
        await tx.task.createMany({
          data: data.tasks.map((t) => ({
            title: t.title,
            description: t.description ?? null,
            status: t.status ?? 'TODO',
            priority: t.priority ?? 'MEDIUM',
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            userId,
            goalId: id,
          })),
        });
      }

      return tx.goal.findUnique({
        where: { id },
        include: { tasks: true },
      });
    });
  }

  // =========================
  // PROGRESS (manual)
  // =========================
  async updateProgress(id: string, userId: string, progress: number) {
    await this.ensureOwnership(id, userId);

    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progresso inválido');
    }

    return this.prisma.goal.update({
      where: { id },
      data: {
        progress,
        completedAt: progress === 100 ? new Date() : null,
        status:
          progress === 100
            ? GoalStatus.COMPLETED
            : GoalStatus.ACTIVE,
      },
    });
  }

  

  async recalcGoalProgress(goalId: string) {
  const goal = await this.prisma.goal.findUnique({
    where: { id: goalId },
    include: { tasks: true },
  });

  if (!goal) return;

  const total = goal.tasks.length;

  if (total === 0) {
    return this.prisma.goal.update({
      where: { id: goalId },
      data: {
        progress: 0,
        status: GoalStatus.ACTIVE,
        completedAt: null,
      },
    });
  }

  const done = goal.tasks.filter(t => t.status === 'DONE').length;

  const progress = Math.round((done / total) * 100);

  return this.prisma.goal.update({
    where: { id: goalId },
    data: {
      progress,
      status: progress === 100 ? GoalStatus.COMPLETED : GoalStatus.ACTIVE,
      completedAt: progress === 100 ? new Date() : null,
    },
  });
}

  // =========================
  // STATUS
  // =========================
  async updateStatus(id: string, userId: string, status: GoalStatus) {
    await this.ensureOwnership(id, userId);

    return this.prisma.goal.update({
      where: { id },
      data: {
        status,
        completedAt:
          status === GoalStatus.COMPLETED
            ? new Date()
            : null,
      },
    });
  }

  // =========================
  // DELETE (soft)
  // =========================
  async remove(id: string, userId: string) {
    await this.ensureOwnership(id, userId);

    return this.prisma.goal.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });
  }

  // =========================
  // VALIDATIONS
  // =========================
  private validateCreate(data: GoalDto) {
    if (!data.title || data.title.trim().length < 3) {
      throw new BadRequestException('Título inválido');
    }
  }

  private validateUpdate(data: GoalDto) {
    if (data.title && data.title.trim().length < 3) {
      throw new BadRequestException('Título inválido');
    }
  }

  private async ensureOwnership(id: string, userId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId, archivedAt: null },
      select: { id: true },
    });

    if (!goal) {
      throw new NotFoundException('Meta não encontrada');
    }
  }
}