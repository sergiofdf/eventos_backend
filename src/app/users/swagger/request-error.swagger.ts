import { ApiProperty } from '@nestjs/swagger';

export class RequestErrorSwagger {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}
