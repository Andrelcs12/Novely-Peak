import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { StreakService } from "./streak.service";
import { UpdateStreakDto } from "./dto/streak.dto";
import { AuthGuard } from "../auth/auth.guard";

@Controller("streak")
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  // =========================
  // UPDATE STREAK
  // =========================
  @UseGuards(AuthGuard)
  @Post("update")
  async update(@Req() req, @Body() dto: UpdateStreakDto) {
    const userId = req.user.id;
    return this.streakService.update(userId, dto);
  }

  // =========================
  // GET STREAK GLOBAL
  // =========================
  @UseGuards(AuthGuard)
  @Get("me")
  async getMyStreak(@Req() req) {
    const userId = req.user.id;
    return this.streakService.get(userId);
  }

  @UseGuards(AuthGuard)
@Get("today")
async getToday(@Req() req) {
  return this.streakService.getToday(req.user.id);
}
}