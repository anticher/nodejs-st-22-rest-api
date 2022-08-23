import { Test } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create.dto';
import { UserRepositoryService } from '../repository/users-repository.service';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';
import { v4 as uuidv4 } from 'uuid';
import { UserResponse } from '../models/user-response.model';
import { HttpException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update.dto';

let mockData: { [id: string]: UserResponse } = {};

const mockUser1 = {
  login: 'mock',
  age: 20,
  password: 'mockPass',
};

const mockUser2 = {
  login: 'mock2',
  age: 22,
  password: 'mockPass2',
};

const mockUUID1 = '0f682e16-4d10-4b16-8999-acc596f435e6';

const mockUUID2 = '0f682e16-4d10-4b16-8999-acc596f435e7';

const mockUserRepositoryService = {
  getAll: () => Object.values(mockData),
  getOne: (id: string) => {
    const result = mockData[id];
    if (result) {
      return result;
    }
    return 'user does not exist';
  },
  addOne: (createUserDto: CreateUserDto) => {
    const loginIndex = Object.values(mockData).findIndex((user) => {
      return user.login.toLowerCase() === createUserDto.login.toLowerCase();
    });
    if (loginIndex >= 0) {
      return 'login is already taken';
    }
    const id = uuidv4();
    const userWithId = { ...createUserDto, id };
    mockData.id = userWithId;
    return userWithId;
  },
  updateOne: (id: string, updateUserDto: UpdateUserDto) => {
    if (!mockData[id]) {
      return 'user does not exist';
    }
    const userWithInputLogin = Object.values(mockData).find((user) => {
      return user.login === updateUserDto.login;
    });
    if (userWithInputLogin && userWithInputLogin[id] !== id) {
      return 'login is already taken';
    }
    mockData[id] = { id, ...updateUserDto };
    return mockData[id];
  },
  removeOne: (id: string) => {
    const user = mockData[id];
    if (!user) {
      return 'user does not exist';
    }
    delete mockData[id];
    return;
  },
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserRepositoryService,
          useValue: mockUserRepositoryService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockData = {};
  });

  describe('should be', () => {
    it('defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('getList', () => {
    it('should return empty array', async () => {
      expect(await controller.getList()).toStrictEqual([]);
    });

    it('should return array with mockUser1', async () => {
      mockData = { [mockUUID1]: { ...mockUser1, id: mockUUID1 } };
      expect(await controller.getList()).toStrictEqual([
        {
          ...mockUser1,
          id: mockUUID1,
        },
      ]);
    });
  });

  describe('addUser', () => {
    it('should throw 400 HttpException', async () => {
      mockData = { [mockUUID1]: { ...mockUser1, id: mockUUID1 } };
      try {
        await controller.addUser(mockUser1);
      } catch (error) {
        expect(error).toHaveProperty('response', 'login is already taken');
        expect(error).toHaveProperty('status', 400);
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should add user', async () => {
      const userWithId = await controller.addUser(mockUser1);
      expect((await controller.getList()).length).toBe(1);
      expect(userWithId).not.toBe(null);
      expect(userWithId).toHaveProperty('login', 'mock');
      expect(userWithId).toHaveProperty('age', 20);
      expect(userWithId).toHaveProperty('password', 'mockPass');
      expect(userWithId).toHaveProperty('id');
    });
  });

  describe('getUser', () => {
    it('should throw HttpException', async () => {
      try {
        await controller.getUser(mockUUID1);
      } catch (error) {
        expect(error).toHaveProperty('response', 'user does not exist');
        expect(error).toHaveProperty('status', 404);
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should return user', async () => {
      const mockUserWithId = { ...mockUser1, id: mockUUID1 };
      mockData[mockUUID1] = mockUserWithId;
      expect(await controller.getUser(mockUUID1)).toBe(mockUserWithId);
    });
  });

  describe('updateUser', () => {
    it('should throw 404 HttpException', async () => {
      try {
        await controller.updateUser(mockUUID1, mockUser1);
      } catch (error) {
        expect(error).toHaveProperty('response', 'user does not exist');
        expect(error).toHaveProperty('status', 404);
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should throw 400 HttpException', async () => {
      const mockUserWithId1 = { ...mockUser1, id: mockUUID1 };
      const mockUserWithId2 = { ...mockUser2, id: mockUUID2 };
      mockData[mockUUID1] = mockUserWithId1;
      mockData[mockUUID2] = mockUserWithId2;
      try {
        await controller.updateUser(mockUUID2, mockUser1);
      } catch (error) {
        expect(error).toHaveProperty('response', 'login is already taken');
        expect(error).toHaveProperty('status', 400);
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should update user', async () => {
      const mockUserWithId1 = { ...mockUser1, id: mockUUID1 };
      mockData[mockUUID1] = mockUserWithId1;
      const result = await controller.updateUser(mockUUID1, mockUser2);
      expect(Object.values(mockData).length).toBe(1);
      expect(result).not.toBe(null);
      expect(result).toHaveProperty('login', 'mock2');
      expect(result).toHaveProperty('age', 22);
      expect(result).toHaveProperty('password', 'mockPass2');
      expect(result).toHaveProperty('id');
    });
  });

  describe('removeUser', () => {
    it('should throw 404 HttpException', async () => {
      try {
        await controller.removeUser(mockUUID1);
      } catch (error) {
        expect(error).toHaveProperty('response', 'user does not exist');
        expect(error).toHaveProperty('status', 404);
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should delete user', async () => {
      const mockUserWithId1 = { ...mockUser1, id: mockUUID1 };
      mockData[mockUUID1] = mockUserWithId1;
      const result = await controller.removeUser(mockUUID1);
      expect(result).toBe(undefined);
      expect(Object.values(mockData).length).toBe(0);
    });
  });
});
