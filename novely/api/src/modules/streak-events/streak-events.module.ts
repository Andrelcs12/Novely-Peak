import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { StreakEventsService } from "./streak-events.service";
import { StreakEventsListener } from "./streak-events.listener";

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [StreakEventsService, StreakEventsListener],
  exports: [StreakEventsService],
})
export class StreakEventsModule {}