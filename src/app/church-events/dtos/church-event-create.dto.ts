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

  @IsNotEmpty({ message: `O valor de nome ${MessagesHelper.NOT_EMPTY}` })
  name?: string;

  @IsDateString({ strict: true, strictSeparator: true }, { message: MessagesHelper.DATE_INVALID })
  startTime?: Date;

  @IsDateString({ strict: true, strictSeparator: true }, { message: MessagesHelper.DATE_INVALID })
  endTime?: Date;

  @IsOptional()
  @IsArray({
    message: MessagesHelper.ARRAY_ATTENDANTS,
  })
  attendants?: User[];
}
