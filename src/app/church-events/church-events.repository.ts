import { ChurchEventDeletedDto } from './dtos/church-event-deleted.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ChurchEvent, ChurchEventDocument } from './schemas/church-event.schema';

@Injectable()
export class ChurchEventsRepository {
  constructor(@InjectModel(ChurchEvent.name) private churchEventModel: Model<ChurchEventDocument>) {}

  async findOne(churchEventFilterQuery: FilterQuery<ChurchEvent>): Promise<ChurchEvent> {
    return await this.churchEventModel.findOne(churchEventFilterQuery);
  }

  async find(churchEventFilterQuery?: FilterQuery<ChurchEvent>): Promise<ChurchEvent[]> {
    return await this.churchEventModel.find(churchEventFilterQuery).populate('attendants').exec();
  }

  async create(churchEvent: ChurchEvent): Promise<ChurchEvent> {
    const newChurchEvent = new this.churchEventModel(churchEvent);
    return await newChurchEvent.save();
  }

  async findOneAndUpdate(
    churchEventFilterQuery: FilterQuery<ChurchEvent>,
    churchEvent: Partial<ChurchEvent>,
  ): Promise<ChurchEvent> {
    return await this.churchEventModel.findOneAndUpdate(churchEventFilterQuery, churchEvent);
  }

  async deleteById(churchEventFilterQuery: FilterQuery<ChurchEventDeletedDto>): Promise<ChurchEventDeletedDto> {
    return await this.churchEventModel.deleteOne(churchEventFilterQuery);
  }
}
