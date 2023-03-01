import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/app/users/schemas/user.schema';
import { AuthRequest } from './../../app/auth/models/auth-request.model';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest<AuthRequest>();

  return request.user;
});
