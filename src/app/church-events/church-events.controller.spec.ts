import { ChurchEventCreateDto } from './dtos/church-event-create.dto';
import { ChurchEventsService } from './church-events.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ChurchEventsController } from './church-events.controller';
import { ChurchEvent } from './schemas/church-event.schema';
import { ChurchEventDeletedDto } from './dtos/church-event-deleted.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
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

const newChurchEventCreate = new ChurchEventCreateDto({
  name: 'tests',
  startTime: new Date(),
  endTime: new Date(),
  attendants: [],
});

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
            getChurchEvents: jest.fn().mockResolvedValue(churchEventsList),
            getChurchEventById: jest.fn().mockResolvedValue(churchEventsList[0]),
            createChurchEvent: jest.fn().mockResolvedValue(churchEventsList[0]),
            updateChurchEvent: jest.fn().mockResolvedValue(churchEventUpdated),
            deleteChurchEventById: jest.fn().mockResolvedValue(deletedChurchEventResult),
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

  describe('getChurchEvents', () => {
    it('should return the list of registered church events', async () => {
      const result = await churchEventsController.getChurchEvents();
      expect(result).toEqual(churchEventsList);
      expect(churchEventsService.getChurchEvents).toBeCalledTimes(1);
    });
  });

  describe('getChurchEventById', () => {
    it('should return the event searched by Id', async () => {
      const result = await churchEventsController.getChurchEventById('1');
      expect(result).toEqual(churchEventsList[0]);
      expect(churchEventsService.getChurchEventById).toBeCalledTimes(1);
    });

    it('should return not found exception if the event is not found', async () => {
      jest.spyOn(churchEventsService, 'getChurchEventById').mockResolvedValueOnce(null);
      await expect(churchEventsController.getChurchEventById('11')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createChurchEvent', () => {
    it('should create a new church events successfully', async () => {
      const result = await churchEventsController.createChurchEvent(newChurchEventCreate);
      expect(result).toEqual(churchEventsList[0]);
      expect(churchEventsService.createChurchEvent).toBeCalledTimes(1);
    });

    it('should reject with bad request error if receive non valid data', () => {
      jest.spyOn(churchEventsService, 'createChurchEvent').mockRejectedValueOnce(new Error());
      expect(churchEventsController.createChurchEvent(newChurchEventCreate)).rejects.toThrowError();
    });

    describe('updateChurchEvent', () => {
      it('should update event data when receives valid id and data', async () => {
        const body = new ChurchEventUpdateDto({
          name: 'testUpdate',
        });
        const result = await churchEventsController.updateChurchEvent('1', body);
        expect(result).toEqual(churchEventUpdated);
      });
      it('should reject with not found error if receive non valid id', async () => {
        const body = new ChurchEventUpdateDto({
          name: 'testUpdate',
        });
        jest.spyOn(churchEventsService, 'updateChurchEvent').mockResolvedValueOnce(null);
        await expect(churchEventsController.updateChurchEvent('11', body)).rejects.toThrowError(NotFoundException);
      });
    });

    describe('deleteChurchEvent', () => {
      it('should delete the specified event when receives valid id', async () => {
        const result = await churchEventsController.deleteChurchEvent('1');
        expect(result.deletedCount).toEqual(1);
      });
      it('should return message with deletedCount 0 if receive non existing event id', async () => {
        const churchEventToDeleteNotFound = new ChurchEventDeletedDto();
        churchEventToDeleteNotFound.deletedCount = 0;
        jest.spyOn(churchEventsService, 'deleteChurchEventById').mockResolvedValueOnce(churchEventToDeleteNotFound);
        const result = await churchEventsController.deleteChurchEvent('11');
        expect(result.deletedCount).toEqual(0);
      });
    });
  });
});
