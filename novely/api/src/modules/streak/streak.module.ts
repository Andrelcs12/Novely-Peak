import { Module } from "@nestjs/common";
import { StreakService } from "./streak.service";
import { StreakController } from "./streak.controller";
import { PrismaService } from "@/prisma.service";
import { StreakEventsModule } from "../streak-events/streak-events.module";

@Module({
  imports: [StreakEventsModule],
  controllers: [StreakController],
  providers: [StreakService, PrismaService],
})
export class StreakModule {}