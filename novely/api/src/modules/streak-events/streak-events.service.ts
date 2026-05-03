import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { StreakEventType } from "./streak-events.types";


@Injectable()
export class StreakEventsService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit(type: StreakEventType, payload: any) {
    this.eventEmitter.emit(type, payload);
  }
}