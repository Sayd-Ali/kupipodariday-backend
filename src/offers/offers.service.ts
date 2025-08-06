import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
      @InjectRepository(Offer)
      private offersRepo: Repository<Offer>,
      @InjectRepository(Wish)
      private wishesRepo: Repository<Wish>,
      @InjectRepository(User)
      private usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesRepo.findOneBy({ id: dto.itemId });
    const user = await this.usersRepo.findOneBy({ id: dto.userId });
    if (!wish || !user) throw new BadRequestException('Wish or User not found');
    const offer = this.offersRepo.create({
      amount: dto.amount,
      hidden: dto.hidden ?? false,
      item: wish,
      user,
    });
    return this.offersRepo.save(offer);
  }

  findOne(filter: FindOptionsWhere<Offer>): Promise<Offer | null> {
    return this.offersRepo.findOne({ where: filter, relations: ['item', 'user'] });
  }

  async updateOne(
      filter: FindOptionsWhere<Offer>,
      dto: UpdateOfferDto,
  ): Promise<Offer | null> {
    const offer = await this.offersRepo.findOne({ where: filter, relations: ['item', 'user'] });
    if (!offer) return null;
    if (dto.amount !== undefined) offer.amount = dto.amount;
    if (dto.hidden !== undefined) offer.hidden = dto.hidden;
    if (dto.itemId) {
      const w = await this.wishesRepo.findOneBy({ id: dto.itemId });
      if (w) offer.item = w;
    }
    if (dto.userId) {
      const u = await this.usersRepo.findOneBy({ id: dto.userId });
      if (u) offer.user = u;
    }
    return this.offersRepo.save(offer);
  }

  async removeOne(filter: FindOptionsWhere<Offer>): Promise<Offer | null> {
    const offer = await this.offersRepo.findOneBy(filter);
    if (!offer) return null;
    await this.offersRepo.remove(offer);
    return offer;
  }
}
