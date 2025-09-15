import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RoleService } from './role.service';
import { Roles } from '../../infrastructure/database/entities';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: jest.Mocked<Repository<Roles>>;

  const mockRole = {
    id: 'role-1',
    name: 'admin',
  } as Roles;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: 'ROLE_REPOSITORY',
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get('ROLE_REPOSITORY');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoles', () => {
    it('should return an array of roles', async () => {
      const mockRoles = [mockRole];
      roleRepository.find.mockResolvedValue(mockRoles);

      const result = await service.getRoles();

      expect(result).toEqual(mockRoles);
      expect(roleRepository.find).toHaveBeenCalled();
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Database error');
      roleRepository.find.mockRejectedValue(error);

      await expect(service.getRoles()).rejects.toThrow(error);
    });
  });

  describe('getRoleById', () => {
    it('should return a role by id', async () => {
      roleRepository.findOne.mockResolvedValue(mockRole);

      const result = await service.getRoleById('role-1');

      expect(result).toEqual(mockRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'role-1' },
      });
    });

    it('should return null when role not found', async () => {
      roleRepository.findOne.mockResolvedValue(null);

      const result = await service.getRoleById('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Database error');
      roleRepository.findOne.mockRejectedValue(error);

      await expect(service.getRoleById('role-1')).rejects.toThrow(error);
    });
  });

  describe('getRoleByName', () => {
    it('should return a role by name', async () => {
      roleRepository.findOne.mockResolvedValue(mockRole);

      const result = await service.getRoleByName('admin');

      expect(result).toEqual(mockRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'admin' },
      });
    });

    it('should return null when role not found', async () => {
      roleRepository.findOne.mockResolvedValue(null);

      const result = await service.getRoleByName('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Database error');
      roleRepository.findOne.mockRejectedValue(error);

      await expect(service.getRoleByName('admin')).rejects.toThrow(error);
    });
  });

  describe('createRole', () => {
    const roleData = {
      name: 'admin',
    };

    it('should throw error when name is undefined', async () => {
      const invalidData = { name: undefined };

      await expect(service.createRole(invalidData)).rejects.toThrow(
        new HttpException('name is undefined', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw error when role with name already exists', async () => {
      roleRepository.findOne.mockResolvedValue(mockRole); // Rol ya existe

      await expect(service.createRole(roleData)).rejects.toThrow(
        new HttpException(
          `Role with name ${roleData.name} exists`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw error when repository save fails', async () => {
      roleRepository.findOne.mockResolvedValue(null);
      const error = new Error('Save failed');
      roleRepository.save.mockRejectedValue(error);

      await expect(service.createRole(roleData)).rejects.toThrow(error);
    });
  });

  describe('editRole', () => {
    const roleDataEdit = {
      name: 'updated-admin',
    };

    it('should edit a role successfully', async () => {
      roleRepository.findOne
        .mockResolvedValueOnce(mockRole) // Existe el rol
        .mockResolvedValueOnce(null); // No existe rol con el nuevo nombre
      roleRepository.save.mockResolvedValue({
        ...mockRole,
        name: 'updated-admin',
      } as Roles);

      const result = await service.editRole('role-1', roleDataEdit);

      expect(result.name).toBe('updated-admin');
      expect(roleRepository.save).toHaveBeenCalled();
    });

    it('should throw error when role does not exist', async () => {
      roleRepository.findOne.mockResolvedValue(null); // No existe el rol

      await expect(
        service.editRole('non-existent', roleDataEdit),
      ).rejects.toThrow(
        new HttpException(
          `Role with id=non-existent not exists`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw error when role with new name already exists', async () => {
      roleRepository.findOne
        .mockResolvedValueOnce(mockRole) // Existe el rol
        .mockResolvedValueOnce(mockRole); // Ya existe rol con el nuevo nombre

      await expect(service.editRole('role-1', roleDataEdit)).rejects.toThrow(
        new HttpException(
          `Role with nombre=${roleDataEdit.name} exists`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw error when repository save fails', async () => {
      roleRepository.findOne
        .mockResolvedValueOnce(mockRole)
        .mockResolvedValueOnce(null);
      const error = new Error('Save failed');
      roleRepository.save.mockRejectedValue(error);

      await expect(service.editRole('role-1', roleDataEdit)).rejects.toThrow(
        error,
      );
    });
  });

  describe('deleteRole', () => {
    it('should delete a role successfully', async () => {
      roleRepository.findOne.mockResolvedValue(mockRole);
      roleRepository.remove.mockResolvedValue(mockRole);

      const result = await service.deleteRole('role-1');

      expect(result).toEqual(mockRole);
      expect(roleRepository.remove).toHaveBeenCalledWith(mockRole);
    });

    it('should throw error when role does not exist', async () => {
      roleRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteRole('non-existent')).rejects.toThrow(
        new HttpException(
          `role with id=non-existent not exists`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw error when repository remove fails', async () => {
      roleRepository.findOne.mockResolvedValue(mockRole);
      const error = new Error('Remove failed');
      roleRepository.remove.mockRejectedValue(error);

      await expect(service.deleteRole('role-1')).rejects.toThrow(error);
    });
  });
});
