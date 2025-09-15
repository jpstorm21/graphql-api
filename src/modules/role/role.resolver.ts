import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Role, RoleData } from '../../types/graphql.schema';
import { RoleService } from './role.service';

@Resolver('Role')
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Query('getRoles')
  async getRoles(): Promise<Role[]> {
    return this.roleService.getRoles();
  }

  @Mutation('createRole')
  async createRole(@Args('input') args: RoleData): Promise<Role> {
    return this.roleService.createRole(args);
  }

  @Mutation('editRole')
  async editRole(
    @Args('id') id: string,
    @Args('input') args: RoleData,
  ): Promise<Role> {
    return this.roleService.editRole(id, args);
  }

  @Mutation('deleteRole')
  async deleteRole(@Args('id') id: string): Promise<Role> {
    return this.roleService.deleteRole(id);
  }
}
