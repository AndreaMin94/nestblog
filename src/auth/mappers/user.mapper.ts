import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user';

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
