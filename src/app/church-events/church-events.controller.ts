import { ChurchEvent } from './schemas/church-event.schema';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChurchEventsService } from './church-events.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ChurchEventCreateDto } from './dtos/church-event-create.dto';

@Controller('church-events')
export class ChurchEventsController {
  constructor(private readonly churchEventsService: ChurchEventsService) {}

  @IsPublic()
  @Get()
  async getChurchEvents(): Promise<ChurchEvent[]> {
    return this.churchEventsService.getChurchEvents();
  }

  @IsPublic()
  @Post()
  async createChurchEvent(@Body() churchEvent: ChurchEventCreateDto): Promise<ChurchEvent> {
    return this.churchEventsService.createChurchEvent(churchEvent);
  }
}
