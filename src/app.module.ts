import { Module } from '@nestjs/common';

import { GraphQlModule } from './graphql/graphql.module';
import { DatabaseModule } from './infrastructure';
import { UserModule, RoleModule } from './modules';

@Module({
  imports: [GraphQlModule, DatabaseModule, UserModule, RoleModule],
})
export class AppModule {}
