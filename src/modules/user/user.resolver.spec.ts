import { Test, TestingModule } from '@nestjs/testing';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: jest.Mocked<UserService>;

  const mockUser = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    rut: '12345678-9',
    password: 'hashedPassword',
    role: {
      id: 'role-1',
      name: 'admin',
    },
  };

  const mockUserData = {
    name: 'Juan Pérez',
    rut: '12345678-9',
    password: 'password123',
    email: 'juan@example.com',
    idRole: 'role-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            getUsers: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockUser];
      userService.getUsers.mockResolvedValue(mockUsers);

      const result = await resolver.getUsers();

      expect(result).toEqual(mockUsers);
      expect(userService.getUsers).toHaveBeenCalled();
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      userService.getUsers.mockRejectedValue(error);

      await expect(resolver.getUsers()).rejects.toThrow(error);
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      userService.createUser.mockResolvedValue(mockUser);

      const result = await resolver.createUser(mockUserData);

      expect(result).toEqual(mockUser);
      expect(userService.createUser).toHaveBeenCalledWith(mockUserData);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      userService.createUser.mockRejectedValue(error);

      await expect(resolver.createUser(mockUserData)).rejects.toThrow(error);
    });
  });
});
