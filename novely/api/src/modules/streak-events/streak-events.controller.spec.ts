import { Test, TestingModule } from '@nestjs/testing';
import { StreakEventsController } from './streak-events.controller';
import { StreakEventsService } from './streak-events.service';

describe('StreakEventsController', () => {
  let controller: StreakEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreakEventsController],
      providers: [StreakEventsService],
    }).compile();

    controller = module.get<StreakEventsController>(StreakEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
