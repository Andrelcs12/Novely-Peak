// modules/tasks/dto/task.dto.ts

import { IsOptional, IsString, IsEnum, IsInt, IsBoolean } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../../../generated/prisma/enums';

export class TaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  dueDate?: Date | null;

  @IsOptional()
  @IsInt()
  estimatedTime?: number | null;

  @IsOptional()
  @IsInt()
  energyLevel?: number | null;

  @IsOptional()
  @IsString()
  category?: string | null;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurrenceRule?: string | null;

  @IsOptional()
  archivedAt?: Date | null;

  @IsOptional()
  @IsString()
  source?: string | null; // "manual" | "import" | "ai" etc
}