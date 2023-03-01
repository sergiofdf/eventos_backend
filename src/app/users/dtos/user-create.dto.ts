import { MessagesHelper } from 'src/helpers/messages.helper';
import { UserRole } from 'src/shared/models/user-role.model';
import { ArrayMinSize, IsEmail, IsNotEmpty, IsArray, IsOptional, IsEmpty } from 'class-validator';
import { EventRole } from 'src/shared/models/event-role.model';
import { UserDependent } from 'src/shared/models/user-dependent.model';

export class UserCreateDto {
  constructor(user?: Partial<UserCreateDto>) {
    this.email = user?.email;
    this.password = user?.password;
    this.name = user?.name;
    this.phoneNumber = user?.phoneNumber;
    this.eventRoles = user?.eventRoles;
    this.role = user?.role;
    this.dependents = user?.dependents;
  }

  @IsEmpty({ message: MessagesHelper.ID_EMPTY })
  _id: string;

  @IsEmail(undefined, { message: MessagesHelper.EMAIL_INVALID })
  email: string;

  @IsNotEmpty({ message: `O valor da senha ${MessagesHelper.NOT_EMPTY}` })
  password: string;

  @IsNotEmpty({ message: `O nome ${MessagesHelper.NOT_EMPTY}` })
  name: string;

  @IsNotEmpty({ message: `O telefone ${MessagesHelper.NOT_EMPTY}` })
  phoneNumber: string;

  @ArrayMinSize(1, {
    message: MessagesHelper.MIN_ROLES,
  })
  eventRoles: EventRole[];

  @IsOptional()
  role: UserRole;

  @IsOptional()
  @IsArray()
  dependents: UserDependent[];
}
