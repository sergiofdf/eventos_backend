import { ApiProperty } from '@nestjs/swagger';

export class LoginBodySwagger {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
