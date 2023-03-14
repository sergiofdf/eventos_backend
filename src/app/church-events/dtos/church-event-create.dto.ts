import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { User } from '../../users/schemas/user.schema';

export class ChurchEventCreateDto {
  constructor(churchEvent?: Partial<ChurchEventCreateDto>) {
    this.name = churchEvent?.name;
    this.startTime = churchEvent?.startTime;
    this.endTime = churchEvent?.endTime;
    this.attendants = churchEvent?.attendants;
  }

  @IsEmpty({ message: MessagesHelper.ID_EMPTY })
  _id?: string;

  @ApiProperty({
    description: 'Nome do evento',
    example: 'Missa sábado manhã',
  })
  @IsNotEmpty({ message: `O valor de nome ${MessagesHelper.NOT_EMPTY}` })
  name?: string;

  @ApiProperty({
    description: 'Data e hora de início',
    example: '2023-03-14T10:00:00.000Z',
  })
  @IsDateString({ strict: true, strictSeparator: true }, { message: MessagesHelper.DATE_INVALID })
  startTime?: Date;

  @ApiProperty({
    description: 'Data e hora de fim',
    example: '2023-03-14T11:00:00.000Z',
  })
  @IsDateString({ strict: true, strictSeparator: true }, { message: MessagesHelper.DATE_INVALID })
  endTime?: Date;

  @ApiPropertyOptional({
    description: 'Array de ids dos participantes do evento.',
    example: ['id1', 'id2', 'id3'],
  })
  @IsOptional()
  @IsArray({
    message: MessagesHelper.ARRAY_ATTENDANTS,
  })
  attendants?: Partial<User>[];
}
