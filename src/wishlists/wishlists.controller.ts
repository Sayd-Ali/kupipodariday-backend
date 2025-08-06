import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlists: WishlistsService) {}

  @Post()
  create(@Body() dto: CreateWishlistDto) {
    return this.wishlists.create(dto);
  }

  @Get()
  findOne(@Query() filter: FindOptionsWhere<Wishlist>) {
    return this.wishlists.findOne(filter);
  }

  @Patch()
  update(
      @Query() filter: FindOptionsWhere<Wishlist>,
      @Body() dto: UpdateWishlistDto,
  ) {
    return this.wishlists.updateOne(filter, dto);
  }

  @Delete()
  remove(@Query() filter: FindOptionsWhere<Wishlist>) {
    return this.wishlists.removeOne(filter);
  }
}
