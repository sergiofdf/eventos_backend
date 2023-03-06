import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const userLoginData = new User({
    _id: '1',
    email: 'teste1@email.com',
    password: '1234572',
    name: 'Nome1',
    phoneNumber: '12341',
  });

  const userReturToValidateLogin = new User({
    _id: '1',
    email: 'teste1@email.com',
    password: '$2b$10$JtJ36yAyU2l0GIL/KvOeqeeh5W9EVQBPmysICq7rvON.JBHg3zoU6',
    name: 'Nome1',
    phoneNumber: '12341',
  });

  const userLoginResponse = {
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZWYwNDA3YS0zMjkyLTQ0YTQtOGRlOC1lMzU3ODQ2MTg1OGEiLCJlbWFpbCI6ImpvYW8yQGVtYWlsLmNvbSIsInJvbGUiOjIsImlhdCI6MTY3Nzc2NjM0MiwiZXhwIjoxNjc3NzY4MTQyfQ.CSlyh9_D8WOEUISEAmb9MYw-6oyWbsXf7OKV6tQb5ac',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { getUserByField: jest.fn().mockResolvedValue(userReturToValidateLogin) },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue(userLoginResponse.access_token) },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT of valid user successfully', async () => {
      const result = await authService.login(userLoginData);
      expect(result).toEqual(userLoginResponse);
    });
  });

  describe('validateUser', () => {
    it('should return the user data if it receives valid email and password', async () => {
      const result = await authService.validateUser('teste1@email.com', '1234572');
      expect(result).toEqual(userReturToValidateLogin);
    });

    it('should return null if receives invalid password', async () => {
      const result = await authService.validateUser('teste1@email.com', '12341');
      expect(result).toEqual(null);
    });

    it('should return null if receives invalid email', async () => {
      jest.spyOn(usersService, 'getUserByField').mockResolvedValueOnce(null);
      const result = await authService.validateUser('teste111@email.com', '12341');
      expect(result).toEqual(null);
    });
  });
});
