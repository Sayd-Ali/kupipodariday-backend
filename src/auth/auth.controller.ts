import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request as ReqDec,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { RequestUser } from './jwt.strategy';

export interface AuthenticatedRequest extends Request {
  user: RequestUser;
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
  signin(@ReqDec() req: AuthenticatedRequest) {
    return this.auth.login({
      id: req.user.userId,
      username: req.user.username,
    });
  }
}
