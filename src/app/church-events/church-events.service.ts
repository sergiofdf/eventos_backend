import { ChurchEventDeletedDto } from './dtos/church-event-deleted.dto';
import { ChurchEvent } from './schemas/church-event.schema';
import { Injectable } from '@nestjs/common';
import { ChurchEventsRepository } from './church-events.repository';
import { ChurchEventCreateDto } from './dtos/church-event-create.dto';
import { randomUUID } from 'crypto';
import { ChurchEventUpdateDto } from './dtos/church-event-update.dto';

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

  async updateChurchEvent(_id: string, churchEventUpdates: ChurchEventUpdateDto): Promise<ChurchEvent> {
    const update = await this.churchEventsRepository.findOneAndUpdate({ _id }, churchEventUpdates);
    if (update) return await this.churchEventsRepository.findOne({ _id });
    return null;
  }

  async deleteChurchEventById(_id: string): Promise<ChurchEventDeletedDto> {
    return await this.churchEventsRepository.deleteById({ _id });
  }
}
