import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from '@/prisma.service';
import { GoalsModule } from '../goals/goals.module';


@Module({
  imports: [GoalsModule], // ✅ certo
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}