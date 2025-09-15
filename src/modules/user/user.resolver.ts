import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { UserService } from './user.service';
import type { User, UserData } from '../../types/graphql.schema';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('getUsers')
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Mutation('createUser')
  async createUser(@Args('input') args: UserData): Promise<User> {
    return this.userService.createUser(args);
  }
}
