import { UserDto } from './user.dto';

export class AuthResponseDto {
  accessToken!: string;
  tokenType!: 'Bearer';
  expiresIn!: string;
  user!: UserDto;
}
