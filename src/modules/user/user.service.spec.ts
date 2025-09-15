import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserService } from './user.service';
import { Users, Roles } from '../../infrastructure/database/entities';
import { encryptPassword } from '../../helpers';

// Mock del helper bcrypt
jest.mock('../../helpers', () => ({
  encryptPassword: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<Users>>;
  let roleRepository: jest.Mocked<Repository<Roles>>;

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
  } as Users;

  const mockRole = {
    id: 'role-1',
    name: 'admin',
  } as Roles;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: 'ROLE_REPOSITORY',
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get('USER_REPOSITORY');
    roleRepository = module.get('ROLE_REPOSITORY');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockUser];
      userRepository.find.mockResolvedValue(mockUsers);

      const result = await service.getUsers();

      expect(result).toEqual(mockUsers);
      expect(userRepository.find).toHaveBeenCalledWith({
        relations: ['role'],
      });
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Database error');
      userRepository.find.mockRejectedValue(error);

      await expect(service.getUsers()).rejects.toThrow(error);
    });
  });

  describe('getUserByRut', () => {
    it('should return a user by RUT', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserByRut('12345678-9');

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        relations: ['role'],
        where: { rut: '12345678-9' },
      });
    });

    it('should return null when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserByRut('99999999-9');

      expect(result).toBeNull();
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Database error');
      userRepository.findOne.mockRejectedValue(error);

      await expect(service.getUserByRut('12345678-9')).rejects.toThrow(error);
    });
  });

  describe('createUser', () => {
    const userData = {
      name: 'Juan Pérez',
      rut: '12345678-9',
      password: 'password123',
      email: 'juan@example.com',
      idRole: 'role-1',
    };

    beforeEach(() => {
      (encryptPassword as jest.Mock).mockResolvedValue(['hashedPassword']);
    });

    it('should create a user successfully', async () => {
      userRepository.findOne.mockResolvedValueOnce(null); // No existe usuario con ese RUT
      roleRepository.findOne.mockResolvedValue(mockRole);
      userRepository.save.mockResolvedValue(mockUser);
      userRepository.findOne.mockResolvedValueOnce(mockUser); // Para el return final

      const result = await service.createUser(userData);

      expect(result).toEqual(mockUser);
      expect(encryptPassword).toHaveBeenCalledWith('password123');
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw error when name is undefined', async () => {
      const invalidData = { ...userData, name: undefined };

      await expect(service.createUser(invalidData)).rejects.toThrow(
        new HttpException('name is undefined', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw error when rut is undefined', async () => {
      const invalidData = { ...userData, rut: undefined };

      await expect(service.createUser(invalidData)).rejects.toThrow(
        new HttpException('rut is undefined', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw error when password is undefined', async () => {
      const invalidData = { ...userData, password: undefined };

      await expect(service.createUser(invalidData)).rejects.toThrow(
        new HttpException('password is undefined', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw error when email is undefined', async () => {
      const invalidData = { ...userData, email: undefined };

      await expect(service.createUser(invalidData)).rejects.toThrow(
        new HttpException('email is undefined', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw error when user with RUT already exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser); // Usuario ya existe

      await expect(service.createUser(userData)).rejects.toThrow(
        new HttpException(
          `User with rut ${userData.rut} exists`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw error when repository save fails', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);
      roleRepository.findOne.mockResolvedValue(mockRole);
      const error = new Error('Save failed');
      userRepository.save.mockRejectedValue(error);

      await expect(service.createUser(userData)).rejects.toThrow(error);
    });
  });
});
