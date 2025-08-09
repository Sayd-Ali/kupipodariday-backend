import {
  Controller,
  Get,
  Post,
  Body,
  Query, UseGuards, Req, Param,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offers: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateOfferDto, @Req() req) {
    return this.offers.create({ ...dto, userId: req.user.userId });
  }

  @Get()
  find(@Query() filter: any) {
    return this.offers.find(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offers.find({ id });
  }
}
