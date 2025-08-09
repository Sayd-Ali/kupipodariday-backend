import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private users: UsersService,
        private hash: HashService,
        private jwt: JwtService,
    ) {}

    async validateUser(username: string, pass: string) {
        const user = await this.users.findOne({ username });
        if (user && await this.hash.compare(pass, user.password)) {
            const { password, ...res } = user;
            return res;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id, username: user.username };
        return { access_token: this.jwt.sign(payload) };
    }

    async signup(dto: CreateUserDto) {
        const hashed = await this.hash.hash(dto.password);
        try {
            return await this.users.create({ ...dto, password: hashed });
        } catch (e: any) {
            if (e.code === '23505') {
                throw new ConflictException('Пользователь с таким email или username уже зарегистрирован');
            }
            throw e;
        }
    }
}
