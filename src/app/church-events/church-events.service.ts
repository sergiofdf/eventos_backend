import { ChurchEvent } from './schemas/church-event.schema';
import { Injectable } from '@nestjs/common';
import { ChurchEventsRepository } from './church-events.repository';
import { ChurchEventCreateDto } from './dtos/church-event-create.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ChurchEventsService {
  constructor(private readonly churchEventsRepository: ChurchEventsRepository) {}

  async getChurchEvents(churchEventsFilterQuery?: Partial<ChurchEvent>): Promise<ChurchEvent[]> {
    return await this.churchEventsRepository.find({ churchEventsFilterQuery });
  }

  async getChurchEventByField(churchEventsFilterQuery: Partial<ChurchEvent>): Promise<ChurchEvent> {
    return await this.churchEventsRepository.findOne(churchEventsFilterQuery);
  }

  async createChurchEvent(churchEvent: ChurchEventCreateDto): Promise<ChurchEvent> {
    const eventEntity = new ChurchEvent({
      _id: randomUUID(),
      ...churchEvent,
    });
    return await this.churchEventsRepository.create(eventEntity);
  }
}
