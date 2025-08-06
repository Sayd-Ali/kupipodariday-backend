import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query, UseGuards, Req, Param,
} from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashService } from 'src/hash/hash.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService,
      private readonly hashService: HashService
  ) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findOne(@Query() filter: FindOptionsWhere<User>) {
    return this.usersService.findOne(filter);
  }

  @Patch()
  update(
      @Query() filter: FindOptionsWhere<User>,
      @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateOne(filter, dto);
  }

  @Delete()
  remove(@Query() filter: FindOptionsWhere<User>) {
    return this.usersService.removeOne(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return this.usersService.findOne({ id: req.user.userId });
  }

  // Редактировать свой профиль (требует JWT)
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    const userId = req.user.userId;
    if (dto.password) {
      dto.password = await this.hashService.hash(dto.password);
    }
    return this.usersService.updateOne({ id: userId }, dto);
  }

  // Получить чужой профиль по username
  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });
    if (user) {
      const { password, ...publicData } = user; // скрываем пароль!
      return publicData;
    }
    return null;
  }

}
