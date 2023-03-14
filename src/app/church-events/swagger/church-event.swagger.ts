import { ChurchEventCreateDto } from './../dtos/church-event-create.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ChurchEventSwagger extends ChurchEventCreateDto {
  @ApiProperty()
  _id: string;
}
