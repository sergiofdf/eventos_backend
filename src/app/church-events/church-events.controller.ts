import { AddParticipantBodySwagger } from './swagger/add-participant-body.swagger';
import { ChurchEventSwagger } from './swagger/church-event.swagger';
import { ChurchEventDeletedDto } from './dtos/church-event-deleted.dto';
import { ChurchEvent } from './schemas/church-event.schema';
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ChurchEventsService } from './church-events.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ChurchEventCreateDto } from './dtos/church-event-create.dto';
import { ChurchEventUpdateDto } from './dtos/church-event-update.dto';
import { User } from '../users/schemas/user.schema';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnauthorizedSwagger } from 'src/shared/swagger/unauthorized.swagger';
import { RequestErrorSwagger } from 'src/shared/swagger/request-error.swagger';
import { DeletedSwagger } from 'src/shared/swagger/deleted.swagger';

@ApiTags('eventos')
@Controller('church-events')
export class ChurchEventsController {
  constructor(private readonly churchEventsService: ChurchEventsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Traz lista de todos eventos cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos encontrada com sucesso',
    type: ChurchEventSwagger,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  async getChurchEvents(): Promise<ChurchEvent[]> {
    return this.churchEventsService.getChurchEvents();
  }

  @Get('my-events')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Traz lista dos eventos cadastrados para o usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos encontrada com sucesso',
    type: ChurchEventSwagger,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  async listMyEvents(@CurrentUser() user: User): Promise<ChurchEvent[]> {
    const result = await this.churchEventsService.listMyEvents(user._id);
    if (!result) {
      throw new NotFoundException('Eventos não encontrados');
    }
    return result;
  }

  @Get(':eventId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Traz informações do evento buscado' })
  @ApiResponse({ status: 200, description: 'Infos do evento encotradas com sucesso', type: ChurchEventSwagger })
  @ApiResponse({ status: 404, description: 'Evento não encontrado', type: RequestErrorSwagger })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  async getChurchEventById(@Param('eventId') eventId: string): Promise<ChurchEvent> {
    const result = await this.churchEventsService.getChurchEventById({ _id: eventId });
    if (!result) {
      throw new NotFoundException('Evento não encontrado');
    }
    return result;
  }

  @IsPublic()
  @Post()
  @ApiOperation({ summary: 'Cadastra novo evento' })
  @ApiResponse({ status: 201, description: 'Evento Criado', type: ChurchEventSwagger })
  @ApiResponse({ status: 400, description: 'Dado inválido', type: RequestErrorSwagger })
  async createChurchEvent(@Body() churchEvent: ChurchEventCreateDto): Promise<ChurchEvent> {
    return this.churchEventsService.createChurchEvent(churchEvent);
  }

  @Patch(':eventId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza dados do evento pelo id informado' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso', type: ChurchEventSwagger })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta evento pelo id informado' })
  @ApiResponse({ status: 200, description: 'Evento deletado com sucesso', type: DeletedSwagger })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  async deleteChurchEvent(@Param('eventId') eventId: string): Promise<ChurchEventDeletedDto> {
    return await this.churchEventsService.deleteChurchEventById(eventId);
  }

  @Patch('add-participant/:eventId/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adiciona participante a um evento' })
  @ApiBody({ required: true, type: AddParticipantBodySwagger })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso', type: ChurchEventSwagger })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  async addParticipantToEvent(@Param('eventId') eventId: string, @Body() _id: Partial<User>): Promise<ChurchEvent> {
    const result = await this.churchEventsService.addParticipant(eventId, _id);
    if (!result) {
      throw new NotFoundException('Evento não encontrado');
    }
    return result;
  }
}
