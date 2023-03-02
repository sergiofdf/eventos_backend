import { UserDeletedDto } from './dtos/user-deleted.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserCreateDto } from './dtos/user-create.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { NotFoundException } from '@nestjs/common/exceptions';

const usersList: User[] = [
  new User({
    _id: '1',
    email: 'teste1@email.com',
    password: '1231',
    name: 'Nome1',
    phoneNumber: '12341',
  }),
  new User({
    _id: '2',
    email: 'teste2@email.com',
    password: '1232',
    name: 'Nome2',
    phoneNumber: '12342',
  }),
  new User({
    _id: '3',
    email: 'teste3@email.com',
    password: '1233',
    name: 'Nome3',
    phoneNumber: '12343',
  }),
];

const newCreatedUser = new User({
  email: 'teste_create@email.com',
  password: '123',
  name: 'teste_create',
  phoneNumber: '9999',
  eventRoles: [1, 2],
});

const updatedUser = new User({
  _id: '2',
  email: 'email_atualizado@email.com',
  password: '1232',
  name: 'Nome2',
  phoneNumber: '12342',
});

const deletedUserResult = new UserDeletedDto();
deletedUserResult.acknowledged = true;
deletedUserResult.deletedCount = 1;

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUserByField: jest.fn().mockReturnValue(usersList[0]),
            getUsers: jest.fn().mockResolvedValue(usersList),
            createUser: jest.fn().mockResolvedValue(newCreatedUser),
            updateUser: jest.fn().mockResolvedValue(updatedUser),
            deleteUserById: jest.fn().mockResolvedValue(deletedUserResult),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return a list of users successfully', async () => {
      const result = await usersController.getUsers();

      expect(result).toEqual(usersList);
    });

    it('should throw an exception if receive an rejection error', () => {
      jest.spyOn(usersService, 'getUsers').mockRejectedValueOnce(new Error());
      expect(usersController.getUsers()).rejects.toThrowError();
    });
  });

  describe('getUser', () => {
    it('should return one single user when it is given a valid id', async () => {
      const result = await usersController.getUser('1');

      expect(result.name).toEqual(usersList[0].name);
      expect(result).toBeInstanceOf(User);
    });

    it('should return not found if no result returns from query', async () => {
      jest.spyOn(usersService, 'getUserByField').mockResolvedValueOnce(null);
      await expect(usersController.getUser('')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should save one new user when receive valid data from body', async () => {
      const body = new UserCreateDto({
        email: 'teste_create@email.com',
        password: '123',
        name: 'teste_create',
        phoneNumber: '9999',
        eventRoles: [1, 2],
      });
      const result = await usersController.createUser(body);

      expect(result).toEqual(newCreatedUser);
      expect(usersService.createUser).toHaveBeenCalledWith(body);
    });

    it('should reject with bad request error if receive non valid data', () => {
      jest.spyOn(usersService, 'createUser').mockRejectedValueOnce(new Error());
      expect(usersController.createUser(newCreatedUser)).rejects.toThrowError();
    });
  });

  describe('updateUser', () => {
    it('should update user data when receives valid id and data', async () => {
      const body = new UserUpdateDto({
        email: 'email_atualizado@email.com',
      });
      const result = await usersController.updateUser('2', body);
      expect(result).toEqual(updatedUser);
    });
    it('should reject with not found error if receive non valid id', async () => {
      const body = new UserUpdateDto({
        email: 'email_atualizado@email.com',
      });
      jest.spyOn(usersService, 'updateUser').mockResolvedValueOnce(null);
      await expect(usersController.updateUser('11', body)).rejects.toThrowError(NotFoundException);
    });
    it('should reject with bad request error if receive non valid data', async () => {
      const body = new UserUpdateDto({
        email: 'email_atualizadoemail.com',
      });
      jest.spyOn(usersService, 'updateUser').mockRejectedValueOnce(new Error());
      expect(usersController.updateUser('1', body)).rejects.toThrowError();
    });
  });

  describe('deleteUser', () => {
    it('should delete the specified user when receives valid id', async () => {
      const result = await usersController.deleteUser('1');
      expect(result.deletedCount).toEqual(1);
    });
    it('should return message with deletedCount 0 if receive non existing user id', async () => {
      const userToDeleteNotFound = new UserDeletedDto();
      userToDeleteNotFound.deletedCount = 0;
      jest.spyOn(usersService, 'deleteUserById').mockResolvedValueOnce(userToDeleteNotFound);
      const result = await usersController.deleteUser('11');
      expect(result.deletedCount).toEqual(0);
    });
  });
});
