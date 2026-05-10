import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard";

import { StreakService } from "./streak.service";

@Controller("streak")
@UseGuards(AuthGuard)
export class StreakController {
  constructor(
    private readonly streakService: StreakService,
  ) {}

  // =========================================
  // UPDATE
  // =========================================

  @Post("update")
  async update(@Req() req: any) {
    return this.streakService.update(
      req.user.id,
    );
  }

  // =========================================
  // GET CURRENT STREAK
  // =========================================

  @Get("me")
  async get(@Req() req: any) {
    return this.streakService.get(
      req.user.id,
    );
  }

  // =========================================
  // GET TODAY
  // =========================================

  @Get("today")
  async getToday(@Req() req: any) {
    return this.streakService.getToday(
      req.user.id,
    );
  }

  // =========================================
  // GET HISTORY
  // =========================================

  @Get("history")
  async getHistory(@Req() req: any) {
    return this.streakService.getHistory(
      req.user.id,
    );
  }

  // =========================================
  // RESET
  // =========================================

  @Post("reset")
  async reset(@Req() req: any) {
    return this.streakService.reset(
      req.user.id,
    );
  }
}