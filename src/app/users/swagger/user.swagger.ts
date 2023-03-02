import { ApiProperty } from '@nestjs/swagger';
import { UserCreateDto } from './../dtos/user-create.dto';

export class UserSwagger extends UserCreateDto {
  @ApiProperty()
  _id: string;
}
