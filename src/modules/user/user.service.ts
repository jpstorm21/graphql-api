import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { Users, Roles } from '../../infrastructure/database/entities';
import type { User, UserData } from '../../types/graphql.schema';
import { encryptPassword } from '../../helpers';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<Users>,
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Roles>,
  ) {}

  async getUsers(): Promise<User[]> {
    this.logger.debug('Fetching users');
    try {
      this.logger.debug('Fetched users successfully');
      return await this.userRepository.find({
        relations: ['role'],
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserByRut(rut: string): Promise<Users> {
    try {
      return this.userRepository.findOne({
        relations: ['role'],
        where: { rut: rut },
      });
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: UserData): Promise<User> {
    try {
      this.logger.debug(`creating user`);
      const { name, rut, password, email, idRole } = userData;

      if (!name) {
        throw new HttpException('name is undefined', HttpStatus.BAD_REQUEST);
      }

      if (!rut) {
        throw new HttpException('rut is undefined', HttpStatus.BAD_REQUEST);
      }

      if (!password) {
        throw new HttpException(
          'password is undefined',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!email) {
        throw new HttpException('email is undefined', HttpStatus.BAD_REQUEST);
      }

      const userByRut = await this.getUserByRut(rut);

      if (userByRut) {
        throw new HttpException(
          `User with rut ${rut} exists`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const roleById = await this.roleRepository.findOne({
        where: { id: idRole },
      });

      if (!roleById) {
        throw new HttpException(
          `Role con id ${roleById} no existe`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = new Users();
      const [passwordHash] = await encryptPassword(password);

      user.name = name;
      user.password = passwordHash;
      user.rut = rut;
      user.email = email;
      user.role = roleById;

      await this.userRepository.save(user);

      return await this.getUserByRut(rut);
    } catch (error) {
      throw error;
    }
  }
}
