import { ChurchEventsService } from './church-events.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ChurchEventsController } from './church-events.controller';

describe('ChurchEventsController', () => {
  let churchEventsController: ChurchEventsController;
  let churchEventsService: ChurchEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChurchEventsController],
      providers: [
        {
          provide: ChurchEventsService,
          useValue: {
            getChurchEvents: jest.fn(),
            getChurchEventByField: jest.fn(),
            createChurchEvent: jest.fn(),
            updateChurchEvent: jest.fn(),
            deleteChurchEventById: jest.fn(),
          },
        },
      ],
    }).compile();

    churchEventsController = module.get<ChurchEventsController>(ChurchEventsController);
    churchEventsService = module.get<ChurchEventsService>(ChurchEventsService);
  });

  it('should be defined', () => {
    expect(churchEventsController).toBeDefined();
    expect(churchEventsService).toBeDefined();
  });
});
