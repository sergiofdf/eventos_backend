import { ChurchEventDeletedDto } from './dtos/church-event-deleted.dto';
import { ChurchEvent } from './schemas/church-event.schema';
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ChurchEventsService } from './church-events.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ChurchEventCreateDto } from './dtos/church-event-create.dto';
import { ChurchEventUpdateDto } from './dtos/church-event-update.dto';
import { User } from '../users/schemas/user.schema';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('church-events')
export class ChurchEventsController {
  constructor(private readonly churchEventsService: ChurchEventsService) {}

  @IsPublic()
  @Get()
  async getChurchEvents(): Promise<ChurchEvent[]> {
    return this.churchEventsService.getChurchEvents();
  }

  @Get('my-events')
  async listMyEvents(@CurrentUser() user: User): Promise<ChurchEvent[]> {
    const result = await this.churchEventsService.listMyEvents(user._id);
    if (!result) {
      throw new NotFoundException('Eventos não encontrados');
    }
    return result;
  }

  @Get(':eventId')
  async getChurchEventById(@Param('eventId') eventId: string): Promise<ChurchEvent> {
    const result = await this.churchEventsService.getChurchEventById({ _id: eventId });
    if (!result) {
      throw new NotFoundException('Evento não encontrado');
    }
    return result;
  }

  @IsPublic()
  @Post()
  async createChurchEvent(@Body() churchEvent: ChurchEventCreateDto): Promise<ChurchEvent> {
    return this.churchEventsService.createChurchEvent(churchEvent);
  }

  @Patch(':eventId')
  async updateChurchEvent(
    @Param('eventId') eventId: string,
    @Body() churchEventUpdateDto: ChurchEventUpdateDto,
  ): Promise<ChurchEvent> {
    const result = await this.churchEventsService.updateChurchEvent(eventId, churchEventUpdateDto);
    if (!result) {
      throw new NotFoundException('Evento não encontrado');
    }
    return result;
  }

  @Delete(':eventId')
  async deleteChurchEvent(@Param('eventId') eventId: string): Promise<ChurchEventDeletedDto> {
    return await this.churchEventsService.deleteChurchEventById(eventId);
  }

  @IsPublic()
  @Patch('add-participant/:eventId/')
  async addParticipantToEvent(@Param('eventId') eventId: string, @Body() _id: Partial<User>): Promise<ChurchEvent> {
    const result = await this.churchEventsService.addParticipant(eventId, _id);
    if (!result) {
      throw new NotFoundException('Evento não encontrado');
    }
    return result;
  }
}
