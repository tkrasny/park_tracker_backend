import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth0User } from '../common/auth/user.decorator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async findByAuth0Id(auth0Id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { auth0Id } });
    if (!user) {
      throw new NotFoundException(`User with Auth0 ID ${auth0Id} not found`);
    }
    return user;
  }

  async createOrUpdateFromAuth0(auth0User: Auth0User): Promise<User> {
    let user = await this.usersRepository.findOne({ 
      where: { auth0Id: auth0User.sub }
    });

    if (!user) {
      // Create new user from Auth0 data
      const userData: DeepPartial<User> = {
        auth0Id: auth0User.sub,
        email: auth0User.email || undefined,
        displayName: auth0User.name || undefined,
        picture: auth0User.picture || undefined,
        username: auth0User.email?.split('@')[0] || auth0User.sub,
      };
      user = this.usersRepository.create(userData);
    } else {
      // Update existing user with latest Auth0 data
      user.email = auth0User.email || user.email;
      user.displayName = auth0User.name || user.displayName;
      user.picture = auth0User.picture || user.picture;
    }

    return await this.usersRepository.save(user);
  }
} 