import { Test } from '@nestjs/testing';
import { CreateGroupDto } from '../dto/create.dto';
import { UpdateGroupDto } from '../dto/update.dto';
import { GroupResponse } from '../models/group-response.model';
import { GroupRepositoryService } from '../repository/group-repository.service';
import { GroupService } from '../services/group.service';
import { GroupController } from './group.controller';
import { v4 as uuidv4 } from 'uuid';
import { HttpException } from '@nestjs/common';
import { UserGroupDto } from '../dto/user-group.dto';
import { UserResponse } from 'src/users/models/user-response.model';

let mockData: { [id: string]: GroupResponse } = {};

let mockUsersData: { [id: string]: UserResponse } = {};

const mockGroup1: CreateGroupDto | UpdateGroupDto = {
  name: 'mock',
  permissions: ['READ'],
};

const mockGroup2: CreateGroupDto | UpdateGroupDto = {
  name: 'mock2',
  permissions: ['READ', 'WRITE'],
};

const mockUUID1 = '0f682e16-4d10-4b16-8999-acc596f435e6';

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

const mockUserUUID1 = '0f682e16-4d10-4b16-8999-acc596f435e8';

const mockUserUUID2 = '0f682e16-4d10-4b16-8999-acc596f435e9';

const mockGroupRepositoryService = {
  getAll: () => Object.values(mockData),
  getOne: (id: string) => {
    const result = mockData[id];
    if (result) {
      return result;
    }
    return null;
  },
  addOne: (createGroupDto: CreateGroupDto) => {
    const nameIndex = Object.values(mockData).findIndex((group) => {
      return group.name === createGroupDto.name;
    });
    if (nameIndex >= 0) {
      return null;
    }
    const id = uuidv4();
    const groupWithId = { ...createGroupDto, id };
    mockData.id = groupWithId;
    return groupWithId;
  },
  updateOne: (id: string, updateGroupDto: UpdateGroupDto) => {
    if (!mockData[id]) {
      return null;
    }
    mockData[id] = { id, ...updateGroupDto };
    return mockData[id];
  },
  removeOne: (id: string) => {
    const group = mockData[id];
    if (!group) {
      return null;
    }
    delete mockData[id];
    return 1;
  },
  addUsersToGroup: (userGroupDto: UserGroupDto) => {
    if (!userGroupDto.groupId) {
      return null;
    }
    for (let i = 0; i < userGroupDto.userIds.length; i += 1) {
      const id = userGroupDto.userIds[i];
      if (!mockUsersData[id]) {
        return null;
      }
    }
    return mockData[userGroupDto.groupId];
  },
};

describe('GroupController', () => {
  let controller: GroupController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        GroupService,
        {
          provide: GroupRepositoryService,
          useValue: mockGroupRepositoryService,
        },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
    mockData = {};
    mockUsersData = {};
  });

  describe('should be', () => {
    it('defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('getList', () => {
    it('should return an array of groups', async () => {
      expect(await controller.getList()).toStrictEqual([]);
    });
  });

  describe('addGroup', () => {
    it('should throw 400 HttpException', async () => {
      const mockGroupWithId1 = { ...mockGroup1, id: mockUUID1 };
      mockData[mockUUID1] = mockGroupWithId1;
      try {
        await controller.addGroup(mockGroup1);
      } catch (error) {
        expect(error).toHaveProperty('response', 'group is already exist');
        expect(error).toHaveProperty('status', 400);
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should add group', async () => {
      const groupWithId = await controller.addGroup(mockGroup1);
      expect((await controller.getList()).length).toBe(1);
      expect(groupWithId).not.toBe(null);
      expect(groupWithId).toHaveProperty('name', 'mock');
      expect(groupWithId).toHaveProperty('permissions', ['READ']);
      expect(groupWithId).toHaveProperty('id');
    });
  });

  describe('getOne', () => {
    it('should return null', async () => {
      const result = await controller.getGroup(mockUUID1);
      expect(result).toBe(null);
    });

    it('should return group1', async () => {
      const mockGroupWithId = { ...mockGroup1, id: mockUUID1 };
      mockData[mockUUID1] = mockGroupWithId;
      expect(await controller.getGroup(mockUUID1)).toBe(mockGroupWithId);
    });
  });

  describe('updateOne', () => {
    it('should throw 404 HttpException', async () => {
      try {
        await controller.updateGroup(mockUUID1, mockGroup1);
      } catch (error) {
        expect(error).toHaveProperty('response', 'group does not exist');
        expect(error).toHaveProperty('status', 404);
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should update group', async () => {
      const mockGroupWithId1 = { ...mockGroup1, id: mockUUID1 };
      mockData[mockUUID1] = mockGroupWithId1;
      const result = await controller.updateGroup(mockUUID1, mockGroup2);
      expect(Object.values(mockData).length).toBe(1);
      expect(result).not.toBe(null);
      expect(result).toHaveProperty('name', 'mock2');
      expect(result).toHaveProperty('permissions', ['READ', 'WRITE']);
      expect(result).toHaveProperty('id');
    });
  });

  describe('removeOne', () => {
    it('should throw 404 HttpException', async () => {
      try {
        await controller.removeGroup(mockUUID1);
      } catch (error) {
        expect(error).toHaveProperty('response', 'group does not exist');
        expect(error).toHaveProperty('status', 404);
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should delete group1', async () => {
      const mockGroupWithId1 = { ...mockGroup1, id: mockUUID1 };
      mockData[mockUUID1] = mockGroupWithId1;
      const result = await controller.removeGroup(mockUUID1);
      expect(result).toBe(null);
      expect(Object.values(mockData).length).toBe(0);
    });
  });

  describe('addUsersToGroup', () => {
    it('should throw 500 HttpException', async () => {
      try {
        await controller.addUsersToGroup({
          groupId: mockUUID1,
          userIds: [mockUserUUID1, mockUserUUID2],
        });
      } catch (error) {
        expect(error).toHaveProperty('response', 'something went wrong');
        expect(error).toHaveProperty('status', 500);
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should validate group and users', async () => {
      mockData = { [mockUUID1]: { ...mockGroup1, id: mockUUID1 } };
      mockUsersData = {
        [mockUserUUID1]: { ...mockUser1, id: mockUserUUID1 },
        [mockUserUUID2]: { ...mockUser2, id: mockUserUUID2 },
      };
      const result = await controller.addUsersToGroup({
        groupId: mockUUID1,
        userIds: [mockUserUUID1, mockUserUUID2],
      });
      expect(result).not.toBe(null);
      expect(result).toHaveProperty('name', 'mock');
      expect(result).toHaveProperty('permissions', ['READ']);
      expect(result).toHaveProperty('id');
    });
  });
});
