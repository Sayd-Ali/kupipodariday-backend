import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('signup')
    signup(@Body() dto: CreateUserDto) {
        return this.auth.signup(dto);
    }

    @UseGuards(AuthGuard('local'))
    @Post('signin')
    signin(@Request() req) {
        return this.auth.login(req.user);
    }

}
