import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Roles } from '../../infrastructure/database/entities';
import type { Role, RoleData } from '../../types/graphql.schema';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Roles>,
  ) {}

  async getRoles(): Promise<Roles[]> {
    try {
      return this.roleRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getRoleById(id: string): Promise<Roles> {
    try {
      return this.roleRepository.findOne({
        where: { id: id },
      });
    } catch (error) {
      throw error;
    }
  }

  async getRoleByName(name: string): Promise<Roles> {
    try {
      return this.roleRepository.findOne({
        where: { name: name },
      });
    } catch (error) {
      throw error;
    }
  }

  async createRole(roleData: RoleData): Promise<Role> {
    try {
      const { name } = roleData;

      if (!name) {
        throw new HttpException('name is undefined', HttpStatus.BAD_REQUEST);
      }

      const roleByName = await this.getRoleByName(name);

      if (roleByName) {
        throw new HttpException(
          `Role with name ${name} exists`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const role = new Roles();

      role.name = name;

      await this.roleRepository.save(role);

      return role;
    } catch (error) {
      throw error;
    }
  }

  async editRole(id: string, roleDataEdit: RoleData): Promise<Roles> {
    try {
      const role = await this.getRoleById(id);

      if (!role) {
        throw new HttpException(
          `Role with id=${id} not exists`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const { name } = roleDataEdit;

      const roleByName = await this.getRoleByName(name);

      if (roleByName) {
        throw new HttpException(
          `Role with nombre=${name} exists`,
          HttpStatus.BAD_REQUEST,
        );
      }

      role.name = name;

      return this.roleRepository.save(role);
    } catch (error) {
      throw error;
    }
  }

  async deleteRole(id: string): Promise<Roles> {
    try {
      const role = await this.getRoleById(id);

      if (!role) {
        throw new HttpException(
          `role with id=${id} not exists`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.roleRepository.remove(role);
    } catch (error) {
      throw error;
    }
  }
}
