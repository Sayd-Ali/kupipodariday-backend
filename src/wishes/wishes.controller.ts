import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Param,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishes: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWishDto, @Req() req) {
    return this.wishes.create({ ...dto, ownerId: req.user.userId });
  }

  @Get('last')
  getLast() {
    return this.wishes.getLast();
  }

  @Get('top')
  getTop() {
    return this.wishes.getTop();
  }

  @Get(':id')
  getOne(@Param('id') id: number, @Req() req) {
    const viewerId = req.user?.userId;
    return this.wishes.findOneById(+id, viewerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateWishDto, @Req() req) {
    return this.wishes.updateProtectedWish(+id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.wishes.removeProtectedWish(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() req) {
    return this.wishes.copyWish(+id, req.user.userId);
  }
}
