import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { StreakEventType } from "./streak-events.types";


@Injectable()
export class StreakEventsListener {

  @OnEvent(StreakEventType.STREAK_UP)
  handleUp(payload: any) {
    console.log("🔥 STREAK UP:", payload);
  }

  @OnEvent(StreakEventType.STREAK_WARNING)
  handleWarning(payload: any) {
    console.log("⚠️ STREAK WARNING:", payload);
  }

  @OnEvent(StreakEventType.STREAK_BROKEN)
  handleBroken(payload: any) {
    console.log("❌ STREAK BROKEN:", payload);
  }
}