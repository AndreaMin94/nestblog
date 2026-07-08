import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponse } from './http/register.response';
import { LoginResponse } from './http/login.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    const user = await this.authService.register(registerDto);
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.login(loginDto);
    return { message: 'User logged in successfully', user };
  }
}
