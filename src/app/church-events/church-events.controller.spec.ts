import { Test, TestingModule } from '@nestjs/testing';
import { ChurchEventsController } from './church-events.controller';

describe('ChurchEventsController', () => {
  let controller: ChurchEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChurchEventsController],
    }).compile();

    controller = module.get<ChurchEventsController>(ChurchEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
