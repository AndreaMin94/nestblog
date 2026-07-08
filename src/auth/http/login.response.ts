import { UserDto } from '../dto/user.dto';

export class LoginResponse {
  message!: string;
  user!: UserDto | null;
}
