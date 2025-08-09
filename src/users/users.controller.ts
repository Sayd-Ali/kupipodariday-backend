import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  Param,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from 'src/hash/hash.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService,
      private readonly hashService: HashService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return this.usersService.findOne({ id: req.user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    const userId = req.user.userId;
    if (dto.password) {
      dto.password = await this.hashService.hash(dto.password);
    }
    try {
      return await this.usersService.updateOne({ id: userId }, dto);
    } catch (e: any) {
      if (e.code === '23505') {
        throw new ConflictException('Пользователь с таким email или username уже зарегистрирован');
      }
      throw e;
    }
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });
    if (user) {
      const { password, ...publicData } = user;
      return publicData;
    }
    return null;
  }

  @Post('find')
  async findUsersPost(@Body('query') query: string) {
    if (!query) return [];
    const users = await this.usersService.findMany(query);
    return users.map(({ password, ...user }) => user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  async getMyWishes(@Req() req) {
    return this.usersService.getWishesByUserId(req.user.userId);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }
}
