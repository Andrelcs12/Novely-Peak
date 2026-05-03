export class StreakResponseDto {
  current: number;
  best: number;
  status: "ACTIVE" | "BROKEN" | "FROZEN";
  updated: boolean;
  message: string;
}


import { IsNumber, Min, Max } from "class-validator";

export class UpdateStreakDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;
}