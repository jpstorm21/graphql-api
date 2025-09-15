import { Test, TestingModule } from '@nestjs/testing';

import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';
import { Roles } from '../../infrastructure/database/entities/role.entity';

describe('RoleResolver', () => {
  let resolver: RoleResolver;
  let roleService: jest.Mocked<RoleService>;

  const mockRole = {
    id: 'role-1',
    name: 'admin',
  };

  const mockRoleData = {
    name: 'admin',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleResolver,
        {
          provide: RoleService,
          useValue: {
            getRoles: jest.fn(),
            createRole: jest.fn(),
            editRole: jest.fn(),
            deleteRole: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<RoleResolver>(RoleResolver);
    roleService = module.get(RoleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getRoles', () => {
    it('should return an array of roles', async () => {
      const mockRoles = [mockRole];
      roleService.getRoles.mockResolvedValue(mockRoles as Roles[]);

      const result = await resolver.getRoles();

      expect(result).toEqual(mockRoles);
      expect(roleService.getRoles).toHaveBeenCalled();
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      roleService.getRoles.mockRejectedValue(error);

      await expect(resolver.getRoles()).rejects.toThrow(error);
    });
  });

  describe('createRole', () => {
    it('should create a role successfully', async () => {
      roleService.createRole.mockResolvedValue(mockRole);

      const result = await resolver.createRole(mockRoleData);

      expect(result).toEqual(mockRole);
      expect(roleService.createRole).toHaveBeenCalledWith(mockRoleData);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      roleService.createRole.mockRejectedValue(error);

      await expect(resolver.createRole(mockRoleData)).rejects.toThrow(error);
    });
  });

  describe('editRole', () => {
    it('should edit a role successfully', async () => {
      const updatedRole = { ...mockRole, name: 'updated-admin' };
      roleService.editRole.mockResolvedValue(updatedRole as Roles);

      const result = await resolver.editRole('role-1', mockRoleData);

      expect(result).toEqual(updatedRole);
      expect(roleService.editRole).toHaveBeenCalledWith('role-1', mockRoleData);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      roleService.editRole.mockRejectedValue(error);

      await expect(resolver.editRole('role-1', mockRoleData)).rejects.toThrow(
        error,
      );
    });
  });

  describe('deleteRole', () => {
    it('should delete a role successfully', async () => {
      roleService.deleteRole.mockResolvedValue(mockRole as Roles);

      const result = await resolver.deleteRole('role-1');

      expect(result).toEqual(mockRole);
      expect(roleService.deleteRole).toHaveBeenCalledWith('role-1');
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      roleService.deleteRole.mockRejectedValue(error);

      await expect(resolver.deleteRole('role-1')).rejects.toThrow(error);
    });
  });
});
