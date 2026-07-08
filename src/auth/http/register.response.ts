import { UserDto } from '../dto/user.dto';

export class RegisterResponse {
  message!: string;
  user!: UserDto;
}
