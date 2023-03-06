import { User } from 'src/app/users/schemas/user.schema';
import { AuthRequest } from './models/auth-request.model';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const userLoginData = new User({
    _id: '1',
    email: 'teste1@email.com',
    password: '1231',
    name: 'Nome1',
    phoneNumber: '12341',
  });

  const userLoginResponse = {
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZWYwNDA3YS0zMjkyLTQ0YTQtOGRlOC1lMzU3ODQ2MTg1OGEiLCJlbWFpbCI6ImpvYW8yQGVtYWlsLmNvbSIsInJvbGUiOjIsImlhdCI6MTY3Nzc2NjM0MiwiZXhwIjoxNjc3NzY4MTQyfQ.CSlyh9_D8WOEUISEAmb9MYw-6oyWbsXf7OKV6tQb5ac',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockReturnValue(userLoginResponse),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT of valid user successfully', async () => {
      const result = await authController.login(userLoginData);

      expect(result).toEqual(userLoginResponse);
    });

    it('should throw an unauthorized exception if it receives non valid email or password', () => {
      jest.spyOn(authService, 'login').mockRejectedValueOnce(new Error());
      expect(authController.login(userLoginData)).rejects.toThrowError();
    });
  });
});
