import { DataSource } from 'typeorm';
import { Users, Roles } from '../../infrastructure/database/entities';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Roles),
    inject: ['DATA_SOURCE'],
  },
];
