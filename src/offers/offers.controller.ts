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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offers: OffersService) {}

  @Post()
  create(@Body() dto: CreateOfferDto) {
    return this.offers.create(dto);
  }

  @Get()
  findOne(@Query() filter: FindOptionsWhere<Offer>) {
    return this.offers.findOne(filter);
  }

  @Patch()
  update(
      @Query() filter: FindOptionsWhere<Offer>,
      @Body() dto: UpdateOfferDto,
  ) {
    return this.offers.updateOne(filter, dto);
  }

  @Delete()
  remove(@Query() filter: FindOptionsWhere<Offer>) {
    return this.offers.removeOne(filter);
  }
}
