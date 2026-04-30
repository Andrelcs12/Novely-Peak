// modules/goals/goals.controller.ts

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

import { GoalsService } from './goals.service';
import { AuthGuard } from '../auth/auth.guard';
import { GoalDto } from './dto/goals.dto';

// Mesmo padrão de segurança do TasksController:
// AuthGuard em nível de controller, userId sempre de req.user.id
@UseGuards(AuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.goalsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.goalsService.findOne(id, req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: GoalDto) {
    return this.goalsService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: GoalDto,
  ) {
    return this.goalsService.update(id, req.user.id, dto);
  }

  // Rota dedicada para progresso — evita conflito com update()
  @Patch(':id/progress')
  updateProgress(
    @Param('id') id: string,
    @Req() req: any,
    @Body('progress') progress: number,
  ) {
    if (progress === undefined || progress === null) {
      throw new BadRequestException('progress é obrigatório');
    }
    return this.goalsService.updateProgress(id, req.user.id, Number(progress));
  }

  // Rota dedicada para status — mesmo padrão do toggleStatus das tasks
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body('status') status: string,
  ) {
    const validStatuses = Object.values(GoalStatus);
    if (!validStatuses.includes(status as GoalStatus)) {
      throw new BadRequestException('Status inválido');
    }
    return this.goalsService.updateStatus(id, req.user.id, status as GoalStatus);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.goalsService.remove(id, req.user.id);
  }
}