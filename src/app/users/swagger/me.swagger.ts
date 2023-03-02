import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/shared/models/user-role.model';

export class meSwagger {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: UserRole;
}
