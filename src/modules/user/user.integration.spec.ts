import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Users, Roles } from '../../infrastructure/database/entities';

describe('UserModule Integration', () => {
  let module: TestingModule;
  let userService: UserService;
  let userResolver: UserResolver;
  let userRepository: Repository<Users>;
  let roleRepository: Repository<Roles>;

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

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider('USER_REPOSITORY')
      .useValue({
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider('ROLE_REPOSITORY')
      .useValue({
        findOne: jest.fn(),
      })
      .compile();

    userService = module.get<UserService>(UserService);
    userResolver = module.get<UserResolver>(UserResolver);
    userRepository = module.get('USER_REPOSITORY');
    roleRepository = module.get('ROLE_REPOSITORY');
  });

  afterEach(async () => {
    await module.close();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide UserService', () => {
    expect(userService).toBeDefined();
  });

  it('should provide UserResolver', () => {
    expect(userResolver).toBeDefined();
  });

  it('should provide repositories', () => {
    expect(userRepository).toBeDefined();
    expect(roleRepository).toBeDefined();
  });

  describe('UserService and UserResolver integration', () => {
    it('should work together for getUsers', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

      const serviceResult = await userService.getUsers();
      const resolverResult = await userResolver.getUsers();

      expect(serviceResult).toEqual(mockUsers);
      expect(resolverResult).toEqual(mockUsers);
    });
  });
});
