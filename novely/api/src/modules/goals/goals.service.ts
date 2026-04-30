// modules/goals/goals.service.ts

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
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  // =========================
  // FIND ONE (secure)
  // =========================
  async findOne(id: string, userId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!goal) {
      throw new NotFoundException('Meta não encontrada');
    }

    return goal;
  }

  // =========================
  // CREATE
  // =========================
  async create(userId: string, data: GoalDto) {
    this.validateGoalInput(data);

    return this.prisma.goal.create({
      data: {
        title: data.title!.trim(),
        description: data.description ?? null,

        status: (data.status as any) ?? 'ACTIVE',
        priority: (data.priority as any) ?? 'MEDIUM',
        progress: data.progress ?? 0,

        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        completedAt: null,

        category: data.category ?? null,
        color: data.color ?? null,
        icon: data.icon ?? null,

        archivedAt: null,

        user: {
          connect: { id: userId },
        },
      },
    });
  }

  // =========================
  // UPDATE
  // NÃO atualiza status/progress aqui — use rotas dedicadas
  // =========================
  async update(id: string, userId: string, data: GoalDto) {
    await this.ensureOwnership(id, userId);
    this.validateGoalInput(data);

    return this.prisma.goal.update({
      where: { id },
      data: {
        title: data.title?.trim(),
        description: data.description,
        priority: data.priority as any,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        category: data.category,
        color: data.color,
        icon: data.icon,
        updatedAt: new Date(),
      },
    });
  }

  // =========================
  // UPDATE PROGRESS
  // Rota: PATCH /goals/:id/progress
  // Body: { progress: 0–100 }
  // =========================
  async updateProgress(id: string, userId: string, progress: number) {
    await this.ensureOwnership(id, userId);

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      throw new BadRequestException('Progresso deve ser entre 0 e 100');
    }

    // Auto-completa se chegar em 100
    const completedAt = progress === 100 ? new Date() : null;
    const status = progress === 100 ? 'COMPLETED' : undefined;

    return this.prisma.goal.update({
      where: { id },
      data: {
        progress,
        ...(completedAt !== null && { completedAt }),
        ...(status && { status }),
      },
    });
  }

  // =========================
  // UPDATE STATUS
  // Rota: PATCH /goals/:id/status
  // Body: { status: GoalStatus }
  // =========================
  async updateStatus(id: string, userId: string, status: GoalStatus) {
    await this.ensureOwnership(id, userId);

    const validStatuses = Object.values(GoalStatus);
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Status inválido');
    }

    const completedAt =
      status === GoalStatus.COMPLETED ? new Date() : null;

    return this.prisma.goal.update({
      where: { id },
      data: {
        status: status as any,
        ...(completedAt !== null && { completedAt }),
      },
    });
  }

  // =========================
  // DELETE (soft delete)
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
  // VALIDATION
  // =========================
  private validateGoalInput(data: GoalDto) {
    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length < 3) {
        throw new BadRequestException('Título muito curto');
      }
      if (data.title.length > 120) {
        throw new BadRequestException('Título muito longo');
      }
    }

    if (data.progress !== undefined) {
      if (data.progress < 0 || data.progress > 100) {
        throw new BadRequestException('Progresso deve ser entre 0 e 100');
      }
    }

    if (data.dueDate && new Date(data.dueDate) < new Date('2020-01-01')) {
      throw new BadRequestException('Data inválida');
    }

    if (data.color && !/^#[0-9a-fA-F]{6}$/.test(data.color)) {
      throw new BadRequestException('Cor inválida (use hex: #rrggbb)');
    }
  }

  // =========================
  // OWNERSHIP CHECK
  // =========================
  private async ensureOwnership(id: string, userId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!goal) {
      throw new NotFoundException('Meta não encontrada');
    }
  }
}