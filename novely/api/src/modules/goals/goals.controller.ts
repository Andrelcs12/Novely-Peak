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
import { GoalStatus } from '../../../generated/prisma/enums';

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
  create(@Req() req: any, @Body() dto: GoalDto & { taskIds?: string[] }) {
    return this.goalsService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: GoalDto & { taskIds?: string[] },
  ) {
    return this.goalsService.update(id, req.user.id, dto);
  }

  @Patch(':id/progress')
  updateProgress(
    @Param('id') id: string,
    @Req() req: any,
    @Body('progress') progress: number,
  ) {
    if (progress === undefined) {
      throw new BadRequestException('progress obrigatório');
    }

    return this.goalsService.updateProgress(
      id,
      req.user.id,
      Number(progress),
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body('status') status: GoalStatus,
  ) {
    return this.goalsService.updateStatus(
      id,
      req.user.id,
      status,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.goalsService.remove(id, req.user.id);
  }
}