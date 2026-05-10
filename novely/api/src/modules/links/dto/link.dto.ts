// modules/links/dto/link.dto.ts

import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsInt,
  IsUrl,
} from "class-validator";

import { LinkType } from "../../../../generated/prisma/enums";

export class LinkDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsEnum(LinkType)
  type?: LinkType;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  @IsString()
  goalId?: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsInt()
  readingTime?: number;
}