import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth0User } from '../common/auth/user.decorator';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      this.logger.error(
        `Error finding all users: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Error finding user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { username } });
      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Error finding user with username ${username}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);

      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUser = await this.usersRepository.findOne({
          where: { username: updateUserDto.username },
        });
        if (existingUser) {
          throw new ConflictException('Username already exists');
        }
      }

      Object.assign(user, updateUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(
        `Error updating user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.usersRepository.remove(user);
    } catch (error) {
      this.logger.error(
        `Error removing user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByAuth0Id(auth0Id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { auth0Id } });
      if (!user) {
        throw new NotFoundException(`User with Auth0 ID ${auth0Id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Error finding user with Auth0 ID ${auth0Id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createOrUpdateFromAuth0(auth0User: Auth0User): Promise<User> {
    try {
      if (!auth0User.sub) {
        throw new Error('Invalid Auth0 user - missing sub claim');
      }

      let user = await this.usersRepository.findOne({
        where: { auth0Id: auth0User.sub },
      });

      if (!user) {
        // Create new user from Auth0 data
        const userData: DeepPartial<User> = {
          auth0Id: auth0User.sub,
          email: auth0User.email,
          displayName: auth0User.name,
          picture: auth0User.picture,
          username: auth0User.email?.split('@')[0] || auth0User.sub,
        };

        user = this.usersRepository.create(userData);
      } else {
        // Update existing user with latest Auth0 data
        user.email = auth0User.email || user.email;
        user.displayName = auth0User.name || user.displayName;
        user.picture = auth0User.picture || user.picture;
      }

      const savedUser = await this.usersRepository.save(user);
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Error creating/updating user from Auth0: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
