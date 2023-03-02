import { ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional({
    description: 'Email em formato válido.',
    example: 'seuendereco@email.com',
  })
  @IsOptional()
  @IsEmail(undefined, { message: 'O e-mail informado é inválido' })
  email: string;

  @ApiPropertyOptional({
    description: 'Senha que será atualizada.',
    example: 'Senha123!',
  })
  @IsOptional()
  password: string;

  @ApiPropertyOptional({
    description: 'Nome completo.',
    example: 'João Antunes Silva',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Nome não deve ser vazio' })
  name: string;

  @ApiPropertyOptional({
    description: 'Número do celular.',
    example: '(14) 91234-1234',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Telefone não deve ser vazio' })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Array de números correspondente às funções que executa na paróquia.',
    example: [1, 3, 4],
  })
  @IsOptional()
  @ArrayMinSize(1, {
    message: 'Função não deve ser vazia',
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
