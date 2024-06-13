import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject('RMQ_SERVICE') private rmqService: ClientProxy,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    // Check if the email already exists in the database
    const existingUser = await this.usersRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Create a new user if the email is not taken
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(newUser);
    this.logger.log(`New user created, id: ${savedUser.id}`);

    // await schedulePushNotification(res.userId)
    this.rmqService.emit('user_created', {
      userId: savedUser.id,
      name: savedUser.name,
    });

    return savedUser;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const result = await this.usersRepository.update(userId, updateUserDto);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User updated, id: ${user.id}`);
    return user;
  }

  async remove(userId: string): Promise<void> {
    const result = await this.usersRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    this.logger.log(`User deleted, id: ${userId}`);
  }
}
