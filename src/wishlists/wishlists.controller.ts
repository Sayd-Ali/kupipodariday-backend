import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query, UseGuards, Param, Req, ForbiddenException, NotFoundException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlists: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWishlistDto, @Req() req) {
    return this.wishlists.create({ ...dto, ownerId: req.user.userId });
  }

  @Get()
  findAll(@Query() filter: Wishlist[]) {
    return this.wishlists.find(filter);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.wishlists.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateWishlistDto, @Req() req) {
    const wl = await this.wishlists.findById(+id);
    if (!wl) throw new NotFoundException('Подборка не найдена');
    if (wl.owner.id !== req.user.userId) throw new ForbiddenException('Можно менять только свои подборки');
    return this.wishlists.updateOne(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const wl = await this.wishlists.findById(+id);
    if (!wl) throw new NotFoundException('Подборка не найдена');
    if (wl.owner.id !== req.user.userId) throw new ForbiddenException('Можно удалять только свои подборки');
    return this.wishlists.removeOne(+id);
  }
}
