import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Roles } from './role.entity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'password', type: 'text' })
  password: string;

  @Column({ name: 'email', type: 'text' })
  email: string;

  @Column({ name: 'rut', type: 'text' })
  rut: string;

  @Column({ name: 'id_role', type: 'uuid', nullable: true })
  @JoinColumn({ name: 'id_role' })
  @ManyToOne(() => Roles)
  role: Roles;
}
