import { Module } from '@nestjs/common';

import { roleProviders } from './role.providers';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';

@Module({
  providers: [...roleProviders, RoleService, RoleResolver],
})
export class RoleModule {}
