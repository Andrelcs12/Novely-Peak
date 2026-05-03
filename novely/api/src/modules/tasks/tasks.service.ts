import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { PrismaService } from '@/prisma.service';
import { TaskStatus } from '../../../generated/prisma/enums';
import { GoalsService } from '../goals/goals.service';

@Injectable()
export class TasksService {
  constructor(
  private prisma: PrismaService,
  private goalsService: GoalsService, // 🔥 aqui
) {}

  // =========================
  // LIST
  // =========================
  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
        archivedAt: null,
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  // =========================
  // FIND ONE (secure)
  // =========================
  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    return task;
  }
  

  // =========================
  // CREATE (business rules)
  // =========================
  async create(userId: string, data: TaskDto) {
    this.validateTaskInput(data);

    return this.prisma.task.create({
      data: {
        title: data.title?.trim(),
        description: data.description ?? null,

        status: data.status ?? TaskStatus.TODO,
        priority: data.priority ?? 'MEDIUM',

        dueDate: data.dueDate ?? null,
        estimatedTime: data.estimatedTime ?? null,
        energyLevel: data.energyLevel ?? null,
        category: data.category ?? null,

        isRecurring: data.isRecurring ?? false,
        recurrenceRule: data.recurrenceRule ?? null,

        startedAt: null,
        completedAt: null,
        archivedAt: null,

        source: data.source ?? 'manual',

        user: {
          connect: { id: userId },
        },
      },
    });
  }

  // =========================
  // UPDATE (safe + rules)
  // NÃO atualiza status aqui — use toggleStatus()
  // =========================
  async update(id: string, userId: string, data: TaskDto) {
    await this.ensureOwnership(id, userId);

    this.validateTaskInput(data);

    return this.prisma.task.update({
      where: { id },
      data: {
        title: data.title?.trim(),
        description: data.description,

        priority: data.priority,
        dueDate: data.dueDate,
        estimatedTime: data.estimatedTime,
        energyLevel: data.energyLevel,
        category: data.category,

        isRecurring: data.isRecurring,
        recurrenceRule: data.recurrenceRule,

        updatedAt: new Date(),
      },
    });
  }

  // =========================
  // TOGGLE STATUS (SMART RULES)
  // Rota: PATCH /tasks/:id/status
  // Body: { status: "TODO" | "IN_PROGRESS" | "DONE" }
  // =========================
  async toggleStatus(id: string, userId: string, status: TaskStatus) {
    await this.ensureOwnership(id, userId);

    if (!Object.values(TaskStatus).includes(status)) {
      throw new BadRequestException('Status inválido');
    }

    const completedAt = status === TaskStatus.DONE ? new Date() : null;
    const startedAt =
      status === TaskStatus.IN_PROGRESS ? new Date() : undefined;

    return this.prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt,
        // Registra quando a tarefa foi iniciada (analytics futuro)
        ...(startedAt !== undefined && { startedAt }),
      },
    });
  }

  // =========================
  // DELETE (soft delete)
  // =========================
  async remove(id: string, userId: string) {
    await this.ensureOwnership(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });
  }

  // =========================
  // VALIDATION CORE
  // =========================
  private validateTaskInput(data: TaskDto) {
    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length < 3) {
        throw new BadRequestException('Título muito curto');
      }

      if (data.title.length > 120) {
        throw new BadRequestException('Título muito longo');
      }
    }

    if (data.estimatedTime !== undefined && data.estimatedTime !== null) {
      if (data.estimatedTime < 1 || data.estimatedTime > 600) {
        throw new BadRequestException('Tempo estimado inválido (1–600 min)');
      }
    }

    if (data.energyLevel !== undefined && data.energyLevel !== null) {
      if (data.energyLevel < 1 || data.energyLevel > 5) {
        throw new BadRequestException('Energy level deve ser entre 1 e 5');
      }
    }

    if (data.dueDate && new Date(data.dueDate) < new Date('2020-01-01')) {
      throw new BadRequestException('Data inválida');
    }
  }

  // =========================
  // OWNERSHIP CHECK (SEGURANÇA)
  // =========================
  private async ensureOwnership(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }
  }
}