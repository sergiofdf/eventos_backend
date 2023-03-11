import { IsOptional } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

export class ChurchEventCreateDto {
  constructor(churchEvent?: Partial<ChurchEventCreateDto>) {
    this.name = churchEvent?.name;
    this.startTime = churchEvent?.startTime;
    this.endTime = churchEvent?.endTime;
    this.attendants = churchEvent?.attendants;
  }

  @IsOptional()
  _id?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  startTime?: Date;

  @IsOptional()
  endTime?: Date;

  @IsOptional()
  attendants?: User[];
}
