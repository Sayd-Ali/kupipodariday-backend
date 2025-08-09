import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { OfferFilter, OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.controller';

@Controller('offers')
export class OffersController {
  constructor(private readonly offers: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateOfferDto, @Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    return this.offers.create(dto, Number(userId));
  }

  @Get()
  find(@Query() filter: OfferFilter) {
    return this.offers.find(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offers.find({ id });
  }
}
