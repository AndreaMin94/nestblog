import { UserDto } from './user.dto';

export class RegisterResponseDto {
  message!: string;
  user!: UserDto;
}
