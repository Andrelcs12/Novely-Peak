import { Test, TestingModule } from '@nestjs/testing';
import { StreakEventsService } from './streak-events.service';

describe('StreakEventsService', () => {
  let service: StreakEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreakEventsService],
    }).compile();

    service = module.get<StreakEventsService>(StreakEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
