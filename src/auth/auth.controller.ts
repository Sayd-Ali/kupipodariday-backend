import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.auth.signup(dto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  signin(@Request() req: AuthenticatedRequest) {
    return this.auth.login(req.user);
  }
}
