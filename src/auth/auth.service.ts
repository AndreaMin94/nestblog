import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const existingUser = await this.findByEmail(registerDto.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    let user = this.userRepository.create({
      email: registerDto.email,
      password_hash: passwordHash,
    });

    user = await this.userRepository.save(user);

    return UserMapper.toDto(user);
  }

  async login(loginDto: LoginDto): Promise<UserDto | null> {
    const user = await this.findByEmail(loginDto.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return UserMapper.toDto(user);
  }
}
