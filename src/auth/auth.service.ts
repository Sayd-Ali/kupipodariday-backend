import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

export function hasCodeProperty(err: unknown): err is { code: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as Record<string, unknown>).code === 'string'
  );
}

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private hash: HashService,
    private jwt: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.users.findOne({ username });
    if (user && (await this.hash.compare(pass, user.password))) {
      return { userId: user.id, username: user.username };
    }
    return null;
  }

  login(user: Pick<User, 'id' | 'username'>) {
    const payload = { sub: user.id, username: user.username };
    return { access_token: this.jwt.sign(payload) };
  }

  async signup(dto: CreateUserDto) {
    const hashed = await this.hash.hash(dto.password);
    try {
      return await this.users.create({ ...dto, password: hashed });
    } catch (err: unknown) {
      if (hasCodeProperty(err) && err.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
      throw err;
    }
  }
}
