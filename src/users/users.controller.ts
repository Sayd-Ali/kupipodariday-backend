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
import { AuthenticatedRequest } from 'src/auth/auth.controller';
import { hasCodeProperty } from 'src/auth/auth.service';
import { FindOptionsWhere } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const where: FindOptionsWhere<User> = { id: Number(req.user.userId) };
    return this.usersService.findOne(where);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    const update: UpdateUserDto = {} as UpdateUserDto;
    if (dto.username !== undefined) update.username = dto.username;
    if (dto.about !== undefined) update.about = dto.about;
    if (dto.avatar !== undefined) update.avatar = dto.avatar;
    if (dto.email !== undefined) update.email = dto.email;
    if (dto.password) {
      update.password = await this.hashService.hash(dto.password);
    }

    try {
      const where: FindOptionsWhere<User> = {
        id: Number(req.user.userId),
      };
      return await this.usersService.updateOne(where, update);
    } catch (e: unknown) {
      if (hasCodeProperty(e) && e.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
      throw e instanceof Error ? e : new Error(String(e));
    }
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });
    if (user) {
      const { password: _password, ...publicData } = user;
      return publicData;
    }
    return null;
  }

  @Post('find')
  async findUsersPost(@Body('query') query: string) {
    if (!query) return [];
    return this.usersService.findMany(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  async getMyWishes(@Req() req: AuthenticatedRequest) {
    return this.usersService.getWishesByUserId(Number(req.user.userId));
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }
}
