// modules/tasks/dto/task.dto.ts

import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsArray,
  Min,
  Max,
  MaxLength,
  MinLength,
} from "class-validator";
import { TaskPriority, TaskStatus } from "../../../../generated/prisma/enums";

export class TaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
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
  completedAt?: Date | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  estimatedTime?: number | null;

  @IsOptional()
  @IsInt()
  focusTime?: number | null;

  // JSON arrays — validados em runtime no service
  @IsOptional()
  @IsArray()
  checklist?: object[];

  @IsOptional()
  @IsArray()
  links?: object[];

  @IsOptional()
  @IsString()
  goalId?: string | null;
}