import { ApiProperty } from '@nestjs/swagger';

export class LoginReturnSwagger {
  @ApiProperty()
  access_token: string;
}
