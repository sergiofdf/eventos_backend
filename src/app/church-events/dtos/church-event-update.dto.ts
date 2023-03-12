import { IsOptional } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

export class ChurchEventUpdateDto {
  constructor(churchEvent?: Partial<ChurchEventUpdateDto>) {
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
