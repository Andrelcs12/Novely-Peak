import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export enum UserGoal {
  WORK = "WORK",
  STUDY = "STUDY",
  PROJECTS = "PROJECTS",
  LIFE = "LIFE",
}

export enum WorkStyle {
  MINIMAL = "MINIMAL",
  BALANCED = "BALANCED",
  STRUCTURED = "STRUCTURED",
}

export enum DisciplineLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export class CompleteOnboardingDto {
  @IsEnum(UserGoal)
  goal!: UserGoal;

  @IsEnum(WorkStyle)
  workStyle!: WorkStyle;

  @IsEnum(DisciplineLevel)
  discipline!: DisciplineLevel;
}


export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;
}