import { Controller } from '@nestjs/common';
import { StreakEventsService } from './streak-events.service';

@Controller('streak-events')
export class StreakEventsController {
  constructor(private readonly streakEventsService: StreakEventsService) {}
}
