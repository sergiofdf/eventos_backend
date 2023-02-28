import { UserRole } from './../../shared/models/user-role.model';
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

  @IsEmpty({ message: 'O _id não deve ser informado, será criado automaticamente.' })
  _id: string;

  @IsEmail(undefined, { message: 'O e-mail informado é inválido' })
  email: string;

  @IsNotEmpty({ message: 'Um senha deve ser definida' })
  password: string;

  @IsNotEmpty({ message: 'Nome deve ser informado' })
  name: string;

  @IsNotEmpty({ message: 'Telefone deve ser informado' })
  phoneNumber: string;

  @ArrayMinSize(1, {
    message: 'No mínimo uma função deve ser informada',
  })
  eventRoles: EventRole[];

  @IsOptional()
  role: UserRole;

  @IsOptional()
  @IsArray()
  dependents: UserDependent[];
}
