import { DataSource } from 'typeorm';
import { Roles } from '../../infrastructure/database/entities';

export const roleProviders = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Roles),
    inject: ['DATA_SOURCE'],
  },
];
