import { ApiProperty } from '@nestjs/swagger';

export class DeletedSwagger {
  @ApiProperty()
  acknowledged: boolean;
  @ApiProperty()
  deletedCount: number;
}
