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
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TaskDto } from './dto/task.dto';
import { AuthGuard } from '../auth/auth.guard';
import { TaskStatus } from '../../../generated/prisma/enums';

// AuthGuard no controller garante que TODAS as rotas exigem token válido.
// O userId vem sempre de req.user.id (injetado pelo guard após verificar
// o token com Supabase) — nunca do body — impedindo que um usuário
// crie ou acesse tarefas de outro.
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: TaskDto) {
    return this.tasksService.create(req.user.id, dto);
  }

  @Patch('/tasks/:taskId/status')
updateTaskStatus(
  @Param('taskId') taskId: string,
  @Req() req: any,
  @Body('status') status: 'TODO' | 'IN_PROGRESS' | 'DONE',
) {
  return this.goalsService.updateTaskStatus(
    taskId,
    req.user.id,
    status,
  );
}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: TaskDto,
  ) {
    return this.tasksService.update(id, req.user.id, dto);
  }

  @Patch(':id/status')
  toggleStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body('status') status: string,
  ) {
    // Valida e converte string → TaskStatus antes de passar ao service
    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      throw new BadRequestException('Status inválido');
    }

    return this.tasksService.toggleStatus(id, req.user.id, status as TaskStatus);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.remove(id, req.user.id);
  }
}