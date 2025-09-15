import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { RoleModule } from './role.module';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { Roles } from '../../infrastructure/database/entities';

describe('RoleModule Integration', () => {
  let module: TestingModule;
  let roleService: RoleService;
  let roleResolver: RoleResolver;
  let roleRepository: Repository<Roles>;

  const mockRole = {
    id: 'role-1',
    name: 'admin',
  } as Roles;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [RoleModule],
    })
      .overrideProvider('ROLE_REPOSITORY')
      .useValue({
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      })
      .compile();

    roleService = module.get<RoleService>(RoleService);
    roleResolver = module.get<RoleResolver>(RoleResolver);
    roleRepository = module.get('ROLE_REPOSITORY');
  });

  afterEach(async () => {
    await module.close();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide RoleService', () => {
    expect(roleService).toBeDefined();
  });

  it('should provide RoleResolver', () => {
    expect(roleResolver).toBeDefined();
  });

  it('should provide repository', () => {
    expect(roleRepository).toBeDefined();
  });

  describe('RoleService and RoleResolver integration', () => {
    it('should work together for getRoles', async () => {
      const mockRoles = [mockRole];
      jest.spyOn(roleRepository, 'find').mockResolvedValue(mockRoles);

      const serviceResult = await roleService.getRoles();
      const resolverResult = await roleResolver.getRoles();

      expect(serviceResult).toEqual(mockRoles);
      expect(resolverResult).toEqual(mockRoles);
    });

    it('should work together for deleteRole', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole);
      jest.spyOn(roleRepository, 'remove').mockResolvedValue(mockRole);

      const serviceResult = await roleService.deleteRole('role-1');
      const resolverResult = await roleResolver.deleteRole('role-1');

      expect(serviceResult).toEqual(mockRole);
      expect(resolverResult).toEqual(mockRole);
    });
  });
});
