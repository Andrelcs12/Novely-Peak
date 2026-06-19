// modules/tasks/tasks.service.ts

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "@/prisma.service";
import { TaskDto } from "./dto/task.dto";
import { TaskStatus } from "../../../generated/prisma/enums";


@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,

  ) {}

  // ─────────────────────────────────────────────
  // LIST
  // ─────────────────────────────────────────────

  async findAll(userId: string, period?: string) {
    const where: any = { userId };
    const now = new Date();

    if (period === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      // Tarefas criadas hoje OU com dueDate hoje
      where.OR = [
        { createdAt: { gte: start, lte: end } },
        { dueDate: { gte: start, lte: end } },
      ];
    }

    if (period === "7d") {
      const start = new Date();
      start.setDate(start.getDate() - 7);

      where.status = TaskStatus.DONE;
      where.completedAt = { gte: start, lte: now };
    }

    if (period === "overdue") {
      where.dueDate = { lt: now };
      where.status = { not: TaskStatus.DONE };
    }

    return this.prisma.task.findMany({
      where,
      orderBy: [
        { priority: "desc" },
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
      // coluna "links" ainda não existe no banco (schema drift) —
      // omitida até a migration ser aplicada
      omit: { links: true },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      omit: { links: true },
    });

    if (!task) throw new NotFoundException("Task não encontrada");

    return task;
  }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────

  async create(userId: string, data: TaskDto) {
    this.validateTaskInput(data);

    return this.prisma.task.create({
      data: {
        title: data.title!.trim(),
        description: data.description ?? null,
        status: data.status ?? TaskStatus.TODO,
        priority: data.priority ?? "MEDIUM",
        dueDate: data.dueDate ?? null,
        completedAt:
          data.status === TaskStatus.DONE ? (data.completedAt ?? new Date()) : null,
        estimatedTime: data.estimatedTime ?? null,
        focusTime: data.focusTime ?? null,
        // "links" removido do payload de escrita — coluna não existe
        // no banco ainda (ver schema drift no findAll)
        user: { connect: { id: userId } },
        ...(data.goalId ? { goal: { connect: { id: data.goalId } } } : {}),
      },
      omit: { links: true },
    });
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────

  async update(id: string, userId: string, data: TaskDto) {
    await this.ensureOwnership(id, userId);
    this.validateTaskInput(data);

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.estimatedTime !== undefined) updateData.estimatedTime = data.estimatedTime;
    if (data.focusTime !== undefined) updateData.focusTime = data.focusTime;
    if (data.goalId !== undefined) {
      updateData.goalId = data.goalId;
    }
    // "checklist" removido — esse campo não existe no model Task
    // (não é drift, nunca existiu nesse model; provável confusão
    // com o model Subtask, que é uma tabela separada)
    // "links" removido — mesma razão do create/findAll

    // Status via update (ex: edição no modal)
    if (data.status !== undefined) {
      updateData.status = data.status;
      updateData.completedAt =
        data.status === TaskStatus.DONE
          ? (data.completedAt ?? new Date())
          : null;
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: updateData,
      omit: { links: true },
    });

    return task;
  }

  // ─────────────────────────────────────────────
  // TOGGLE STATUS
  // ─────────────────────────────────────────────

  async toggleStatus(id: string, userId: string, status: TaskStatus) {
    await this.ensureOwnership(id, userId);

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt: status === TaskStatus.DONE ? new Date() : null,
      },
      omit: { links: true },
    });

    return task;
  }

  // ─────────────────────────────────────────────
  // DELETE (hard delete — schema não tem archivedAt)
  // ─────────────────────────────────────────────

  async remove(id: string, userId: string) {
    await this.ensureOwnership(id, userId);

    return this.prisma.task.delete({
      where: { id },
      omit: { links: true },
    });
  }

  // ─────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────

  private validateTaskInput(data: TaskDto) {
    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length < 3) {
        throw new BadRequestException("Título muito curto (mínimo 3 caracteres)");
      }
      if (data.title.length > 120) {
        throw new BadRequestException("Título muito longo (máximo 120 caracteres)");
      }
    }

    if (data.estimatedTime != null) {
      if (data.estimatedTime < 1 || data.estimatedTime > 600) {
        throw new BadRequestException("Tempo estimado inválido (1–600 min)");
      }
    }

    if (data.focusTime != null && data.focusTime < 0) {
      throw new BadRequestException("Tempo de foco inválido");
    }

    if (data.dueDate && new Date(data.dueDate) < new Date("2020-01-01")) {
      throw new BadRequestException("Data inválida");
    }

    if (data.checklist !== undefined && !Array.isArray(data.checklist)) {
      throw new BadRequestException("Checklist deve ser um array");
    }

    if (data.links !== undefined && !Array.isArray(data.links)) {
      throw new BadRequestException("Links deve ser um array");
    }
  }

  // ─────────────────────────────────────────────
  // OWNERSHIP CHECK
  // ─────────────────────────────────────────────

  private async ensureOwnership(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!task) throw new NotFoundException("Task não encontrada");
  }
}