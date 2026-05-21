// modules/tasks/tasks.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  BadRequestException,
  Query,
} from "@nestjs/common";

import { TasksService } from "./tasks.service";
import { TaskDto } from "./dto/task.dto";
import { AuthGuard } from "../auth/auth.guard";
import { TaskStatus } from "../../../generated/prisma/enums";

// AuthGuard garante token válido em todas as rotas.
// userId sempre vem de req.user.id (injetado pelo guard após verificar
// o token com Supabase) — nunca do body.
@UseGuards(AuthGuard)
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET /tasks?period=today|7d|overdue|all
  @Get()
  findAll(@Req() req: any, @Query("period") period?: string) {
    return this.tasksService.findAll(req.user.id, period);
  }

  // GET /tasks/:id
  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: any) {
    return this.tasksService.findOne(id, req.user.id);
  }

  // POST /tasks
  @Post()
  create(@Req() req: any, @Body() dto: TaskDto) {
    return this.tasksService.create(req.user.id, dto);
  }

  // PATCH /tasks/:id
  @Patch(":id")
  update(@Param("id") id: string, @Req() req: any, @Body() dto: TaskDto) {
    return this.tasksService.update(id, req.user.id, dto);
  }

  // PATCH /tasks/:id/status
  @Patch(":id/status")
  toggleStatus(
    @Param("id") id: string,
    @Req() req: any,
    @Body("status") status: string,
  ) {
    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      throw new BadRequestException("Status inválido");
    }

    return this.tasksService.toggleStatus(id, req.user.id, status as TaskStatus);
  }

  // DELETE /tasks/:id
  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: any) {
    return this.tasksService.remove(id, req.user.id);
  }
}