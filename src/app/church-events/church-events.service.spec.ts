import { ChurchEventCreateDto } from './dtos/church-event-create.dto';
import { ChurchEventDeletedDto } from './dtos/church-event-deleted.dto';
import { ChurchEventsRepository } from './church-events.repository';
import { ChurchEvent } from './schemas/church-event.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { ChurchEventsService } from './church-events.service';
import { ChurchEventUpdateDto } from './dtos/church-event-update.dto';

const churchEventsList = [
  new ChurchEvent({
    _id: '1',
    name: 'tests',
    startTime: new Date(),
    endTime: new Date(),
    attendants: [],
  }),
];

const churchEventUpdated = new ChurchEvent({
  _id: '2',
  name: 'testUpdate',
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

    it('should return null if no event is found by query filter', async () => {
      jest.spyOn(churchEventsRepository, 'findOne').mockResolvedValueOnce(null);
      const result = await churchEventsService.getChurchEventByField({ _id: '11' });
      expect(result).toBeNull();
    });
  });

  describe('createChurchEvent', () => {
    it('should create a new church event successfully', async () => {
      const churchEventDto = new ChurchEventCreateDto({
        name: 'testeCreate',
        startTime: new Date(),
        endTime: new Date(),
      });
      const result = await churchEventsService.createChurchEvent(churchEventDto);
      expect(result).toBeInstanceOf(ChurchEvent);
      expect(churchEventsRepository.create).toBeCalledTimes(1);
    });
  });

  describe('updateChurchEvent', () => {
    it('should update the specified church event successfully', async () => {
      const churchEventUpdate = new ChurchEventUpdateDto({
        name: 'testUpdate',
      });
      jest.spyOn(churchEventsRepository, 'findOne').mockResolvedValueOnce(churchEventUpdated);
      const result = await churchEventsService.updateChurchEvent('2', churchEventUpdate);
      expect(result.name).toEqual(churchEventUpdate.name);
      expect(churchEventsRepository.findOneAndUpdate).toBeCalledTimes(1);
    });

    it('should return null if no event is found by given _id', async () => {
      jest.spyOn(churchEventsRepository, 'findOneAndUpdate').mockResolvedValueOnce(null);
      const churchEventUpdate = new ChurchEventUpdateDto({
        name: 'testUpdate',
      });
      const result = await churchEventsService.updateChurchEvent('222', churchEventUpdate);
      expect(result).toEqual(null);
    });
  });

  describe('deleteChurchEventById', () => {
    it('should delete a specified church event successfully', async () => {
      const result = await churchEventsService.deleteChurchEventById('1');
      expect(result).toEqual(deletedChurchEventResult);
    });

    it('should return message with deletedCount 0 if receive non existing event id', async () => {
      const eventToDeleteNotFound = new ChurchEventDeletedDto();
      eventToDeleteNotFound.deletedCount = 0;
      jest.spyOn(churchEventsRepository, 'deleteById').mockResolvedValueOnce(eventToDeleteNotFound);
      const result = await churchEventsService.deleteChurchEventById('11');
      expect(result.deletedCount).toEqual(0);
    });
  });
});
