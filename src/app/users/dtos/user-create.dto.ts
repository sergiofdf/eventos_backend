import { MessagesHelper } from 'src/helpers/messages.helper';
import { UserRole } from 'src/shared/models/user-role.model';
import { ArrayMinSize, IsEmail, IsNotEmpty, IsArray, IsOptional, IsEmpty } from 'class-validator';
import { EventRole } from 'src/shared/models/event-role.model';
import { UserDependent } from 'src/shared/models/user-dependent.model';
import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger/dist';

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

  @ApiProperty({
    description: 'Email em formato válido.',
    example: 'seuendereco@email.com',
  })
  @IsEmail(undefined, { message: MessagesHelper.EMAIL_INVALID })
  email: string;

  @ApiProperty({
    description: 'Senha que será cadastrada.',
    example: 'Senha123!',
  })
  @IsNotEmpty({ message: `O valor da senha ${MessagesHelper.NOT_EMPTY}` })
  password: string;

  @ApiProperty({
    description: 'Nome completo.',
    example: 'João Antunes Silva',
  })
  @IsNotEmpty({ message: `O nome ${MessagesHelper.NOT_EMPTY}` })
  name: string;

  @ApiProperty({
    description: 'Número do celular.',
    example: '(14) 91234-1234',
  })
  @IsNotEmpty({ message: `O telefone ${MessagesHelper.NOT_EMPTY}` })
  phoneNumber: string;

  @ApiProperty({
    description: 'Array de números correspondente às funções que executa na paróquia.',
    example: [1, 3, 4],
  })
  @ArrayMinSize(1, {
    message: MessagesHelper.MIN_ROLES,
  })
  eventRoles: EventRole[];

  @ApiPropertyOptional({
    description: 'Número correspondente ao nível de acesso no sistema.',
    example: 3,
  })
  @IsOptional()
  role: UserRole;

  @ApiPropertyOptional({
    description:
      'Array de objetos com informações dos dependentes. Informar o nome e funções na paróquia de cada dependente.',
    example: [
      { name: 'Filho 1', eventRoles: [3] },
      { name: 'Filho 2', eventRoles: [2, 3] },
    ],
  })
  @IsOptional()
  @IsArray()
  dependents: UserDependent[];
}
