import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { EventRole } from 'src/shared/models/event-role.model';
import { UserDependent } from 'src/shared/models/user-dependent.model';
import { UserRole } from 'src/shared/models/user-role.model';

export class UserUpdateDto {
  constructor(user?: Partial<UserUpdateDto>) {
    this.email = user?.email;
    this.password = user?.password;
    this.name = user?.name;
    this.phoneNumber = user?.phoneNumber;
    this.eventRoles = user?.eventRoles;
    this.role = user?.role;
    this.dependents = user?.dependents;
  }

  @IsOptional()
  @IsEmail(undefined, { message: 'O e-mail informado é inválido' })
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Nome não deve ser vazio' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Telefone não deve ser vazio' })
  phoneNumber: string;

  @IsOptional()
  @ArrayMinSize(1, {
    message: 'Função não deve ser vazia',
  })
  eventRoles: EventRole[];

  @IsOptional()
  role: UserRole;

  @IsOptional()
  @IsArray()
  dependents: UserDependent[];
}
