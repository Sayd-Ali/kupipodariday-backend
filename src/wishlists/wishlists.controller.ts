import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  Param,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { WishlistFilter, WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.controller';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlists: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWishlistDto, @Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    return this.wishlists.create(dto, Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() q: Record<string, string>) {
    const filter: WishlistFilter = {
      id: q.id ? Number(q.id) : undefined,
      ownerId: q.ownerId ? Number(q.ownerId) : undefined,
      name: q.name,
    };
    return this.wishlists.find(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.wishlists.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWishlistDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const wishlistId = Number(id);
    const wl = await this.wishlists.findById(wishlistId);
    if (!wl) throw new NotFoundException('Подборка не найдена');
    if (wl.owner.id !== req.user.userId) {
      throw new ForbiddenException('Можно менять только свои подборки');
    }
    return this.wishlists.updateOne(wishlistId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const wishlistId = Number(id);
    const wl = await this.wishlists.findById(wishlistId);
    if (!wl) throw new NotFoundException('Подборка не найдена');
    if (wl.owner.id !== req.user.userId) {
      throw new ForbiddenException('Можно удалять только свои подборки');
    }
    return this.wishlists.removeOne(wishlistId);
  }
}
