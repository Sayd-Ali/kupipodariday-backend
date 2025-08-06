import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
      @InjectRepository(Wishlist)
      private wishlistsRepo: Repository<Wishlist>,
      @InjectRepository(User)
      private usersRepo: Repository<User>,
      @InjectRepository(Wish)
      private wishesRepo: Repository<Wish>,
  ) {}

  async create(dto: CreateWishlistDto): Promise<Wishlist> {
    const owner = await this.usersRepo.findOneBy({ id: dto.ownerId });
    if (!owner) throw new BadRequestException('Owner not found');

    const items = dto.itemIds?.length
        ? await this.wishesRepo.findByIds(dto.itemIds)
        : [];

    const wishlist = this.wishlistsRepo.create({
      ...dto,
      owner,
      items,
    });
    return this.wishlistsRepo.save(wishlist);
  }

  findOne(filter: FindOptionsWhere<Wishlist>): Promise<Wishlist | null> {
    return this.wishlistsRepo.findOne({ where: filter, relations: ['owner', 'items'] });
  }

  async updateOne(
      filter: FindOptionsWhere<Wishlist>,
      dto: UpdateWishlistDto,
  ): Promise<Wishlist | null> {
    const wl = await this.wishlistsRepo.findOne({ where: filter, relations: ['owner', 'items'] });
    if (!wl) return null;

    if (dto.ownerId && dto.ownerId !== wl.owner.id) {
      const owner = await this.usersRepo.findOneBy({ id: dto.ownerId });
      if (!owner) throw new BadRequestException('Owner not found');
      wl.owner = owner;
    }

    if (dto.itemIds) {
      wl.items = dto.itemIds.length
          ? await this.wishesRepo.findByIds(dto.itemIds)
          : [];
    }

    Object.assign(wl, dto);
    return this.wishlistsRepo.save(wl);
  }

  async removeOne(filter: FindOptionsWhere<Wishlist>): Promise<Wishlist | null> {
    const wl = await this.wishlistsRepo.findOneBy(filter);
    if (!wl) return null;
    await this.wishlistsRepo.remove(wl);
    return wl;
  }
}
