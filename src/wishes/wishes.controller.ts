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
import { AuthenticatedRequest } from 'src/auth/auth.controller';
import { RequestUser } from 'src/auth/jwt.strategy';

export type MaybeAuthRequest = Request & { user?: RequestUser };

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishes: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWishDto, @Req() req: AuthenticatedRequest) {
    return this.wishes.create(dto, Number(req.user.userId));
  }

  @Get('last')
  getLast() {
    return this.wishes.getLast();
  }

  @Get('top')
  getTop() {
    return this.wishes.getTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: MaybeAuthRequest) {
    const wishId = Number(id);
    const viewerId = req.user?.userId;
    return this.wishes.findOneById(wishId, viewerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const wishId = Number(id);
    return this.wishes.updateProtectedWish(
      wishId,
      dto,
      Number(req.user.userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const wishId = Number(id);
    return this.wishes.removeProtectedWish(wishId, Number(req.user.userId));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const wishId = Number(id);
    return this.wishes.copyWish(wishId, Number(req.user.userId));
  }
}
