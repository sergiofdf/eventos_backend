import { IsArray, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { User } from '../../users/schemas/user.schema';

export class ChurchEventUpdateDto {
  constructor(churchEvent?: Partial<ChurchEventUpdateDto>) {
    this.name = churchEvent?.name;
    this.startTime = churchEvent?.startTime;
    this.endTime = churchEvent?.endTime;
    this.attendants = churchEvent?.attendants;
  }

  @IsOptional()
  @IsNotEmpty({ message: `O valor de nome ${MessagesHelper.NOT_EMPTY}` })
  name?: string;

  @IsOptional()
  @IsDateString({ strict: true, strictSeparator: true }, { message: MessagesHelper.DATE_INVALID })
  startTime?: Date;

  @IsOptional()
  @IsDateString({ strict: true, strictSeparator: true }, { message: MessagesHelper.DATE_INVALID })
  endTime?: Date;

  @IsOptional()
  @IsArray({
    message: MessagesHelper.ARRAY_ATTENDANTS,
  })
  attendants?: User[];
}
