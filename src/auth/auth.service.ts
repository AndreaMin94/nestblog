import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserMapper } from './mappers/user.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthResponseDto } from './dto/auth-response.dto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const existingUser = await this.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    let user = this.userRepository.create({
      email: registerDto.email,
      password_hash: passwordHash,
    });

    user = await this.userRepository.save(user);

    return UserMapper.toDto(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '1h',
      user: UserMapper.toDto(user),
    };
  }
}
