import { Module } from '@nestjs/common';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { userProviders } from './user.providers';

@Module({
  imports: [],
  providers: [UserResolver, UserService, ...userProviders],
})
export class UserModule {}
