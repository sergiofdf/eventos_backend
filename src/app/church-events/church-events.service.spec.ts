import { ChurchEventDeletedDto } from './dtos/church-event-deleted.dto';
import { ChurchEventsRepository } from './church-events.repository';
import { ChurchEvent } from './schemas/church-event.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { ChurchEventsService } from './church-events.service';

const churchEventsList = [
  new ChurchEvent({
    _id: '1',
    startTime: new Date(),
    endTime: new Date(),
    attendants: [],
  }),
];

const churchEventUpdated = new ChurchEvent({
  _id: '1',
  startTime: new Date(),
  endTime: new Date(),
  attendants: [],
});

const deletedChurchEventResult = new ChurchEventDeletedDto();
deletedChurchEventResult.acknowledged = true;
deletedChurchEventResult.deletedCount = 1;

describe('ChurchEventsService', () => {
  let churchEventsService: ChurchEventsService;
  let churchEventsRepository: ChurchEventsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChurchEventsService,
        {
          provide: ChurchEventsRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue(churchEventsList[0]),
            find: jest.fn().mockResolvedValue(churchEventsList),
            create: jest.fn().mockResolvedValue(churchEventsList[0]),
            findOneAndUpdate: jest.fn().mockResolvedValue(churchEventUpdated),
            deleteById: jest.fn().mockResolvedValue(deletedChurchEventResult),
          },
        },
      ],
    }).compile();

    churchEventsService = module.get<ChurchEventsService>(ChurchEventsService);
    churchEventsRepository = module.get<ChurchEventsRepository>(ChurchEventsRepository);
  });

  it('should be defined', () => {
    expect(churchEventsService).toBeDefined();
    expect(churchEventsRepository).toBeDefined();
  });

  describe('getChurchEvents', () => {
    it('should return the list of church events successfully', async () => {
      const result = await churchEventsService.getChurchEvents();
      expect(result).toEqual(churchEventsList);
      expect(churchEventsRepository.find).toBeCalledTimes(1);
    });
  });

  describe('getChurchEventByField', () => {
    it('should return a specific event given a query filter', async () => {
      const result = await churchEventsService.getChurchEventByField({ _id: '1' });
      expect(result).toEqual(churchEventsList[0]);
    });
  });
});
