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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishes: WishesService) {}

  @Post()
  create(@Body() dto: CreateWishDto) {
    return this.wishes.create(dto);
  }

  @Get()
  findOne(@Query() filter: FindOptionsWhere<Wish>) {
    return this.wishes.findOne(filter);
  }

  @Patch()
  update(
      @Query() filter: FindOptionsWhere<Wish>,
      @Body() dto: UpdateWishDto,
  ) {
    return this.wishes.updateOne(filter, dto);
  }

  @Delete()
  remove(@Query() filter: FindOptionsWhere<Wish>) {
    return this.wishes.removeOne(filter);
  }
}
