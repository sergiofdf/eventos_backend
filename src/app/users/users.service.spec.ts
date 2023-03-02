import { UserUpdateDto } from './dtos/user-update.dto';
import { UserCreateDto } from './dtos/user-create.dto';
import { UsersRepository } from './users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UserDeletedDto } from './dtos/user-deleted.dto';

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

const userUpdated = new User({
  _id: '1',
  email: 'teste_update@email.com',
  password: '1231',
  name: 'Nome1',
  phoneNumber: '12341',
});

const deletedUserResult = new UserDeletedDto();
deletedUserResult.acknowledged = true;
deletedUserResult.deletedCount = 1;

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue(usersList[0]),
            find: jest.fn().mockResolvedValue(usersList),
            create: jest.fn().mockResolvedValue(usersList[0]),
            findOneAndUpdate: jest.fn().mockResolvedValue(userUpdated),
            deleteById: jest.fn().mockResolvedValue(deletedUserResult),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return a list of users successfully', async () => {
      const result = await usersService.getUsers();
      expect(result).toEqual(usersList);
      expect(usersRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserByField', () => {
    it('should return a specif successfully when given a valid id', async () => {
      const result = await usersService.getUserByField({ _id: '1' });
      expect(result).toEqual(usersList[0]);
    });

    it('should return null if no user is found by given id', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      const result = await usersService.getUserByField({ _id: '11' });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully when given valid data', async () => {
      const data = new UserCreateDto({
        email: 'teste@email.com',
        password: '123456',
        name: 'Teste Dto',
      });

      const result = await usersService.createUser(data);
      expect(result).toEqual(usersList[0]);
    });
  });

  describe('updateUser', () => {
    it('should update the user considering given data', async () => {
      const updateData = new UserUpdateDto({
        email: 'teste_update@email.com',
      });

      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(userUpdated);

      const result = await usersService.updateUser('1', updateData);

      expect(result).toEqual(userUpdated);
    });

    it('should return null if no user is found by id to update', async () => {
      const updateData = new UserUpdateDto({
        email: 'teste_update@email.com',
      });
      jest.spyOn(usersRepository, 'findOneAndUpdate').mockResolvedValueOnce(null);

      const result = await usersService.updateUser('11', updateData);

      expect(result).toBeNull();
    });
  });

  describe('deleteUserById', () => {
    it('should delete an user successfully when given valid id', async () => {
      const result = await usersService.deleteUserById('1');

      expect(result).toEqual(deletedUserResult);
    });
    it('should return message with deletedCount 0 if receive non existing user id', async () => {
      const userToDeleteNotFound = new UserDeletedDto();
      userToDeleteNotFound.deletedCount = 0;
      jest.spyOn(usersRepository, 'deleteById').mockResolvedValueOnce(userToDeleteNotFound);
      const result = await usersService.deleteUserById('11');
      expect(result.deletedCount).toEqual(0);
    });
  });
});
