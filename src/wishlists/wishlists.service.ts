import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

export type WishlistFilter = {
  id?: number;
  name?: string;
  ownerId?: number;
};

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

  async create(dto: CreateWishlistDto, ownerId: number): Promise<Wishlist> {
    const owner = await this.usersRepo.findOneBy({ id: ownerId });
    if (!owner) throw new Error('Владелец не найден');

    const items = dto.itemsId?.length
      ? await this.wishesRepo.findBy({ id: In(dto.itemsId) })
      : [];

    const wishlist = this.wishlistsRepo.create({
      name: dto.name,
      description: dto.description,
      image: dto.image,
      owner,
      items,
    });

    return this.wishlistsRepo.save(wishlist);
  }

  async find(filter: WishlistFilter = {}): Promise<Wishlist[]> {
    const where: FindOptionsWhere<Wishlist> = {
      ...(typeof filter.id === 'number' ? { id: filter.id } : {}),
      ...(typeof filter.name === 'string' ? { name: filter.name } : {}),
      ...(typeof filter.ownerId === 'number'
        ? { owner: { id: filter.ownerId } }
        : {}),
    };

    return this.wishlistsRepo.find({
      where,
      relations: ['owner', 'items'],
    });
  }

  async findById(id: number): Promise<Wishlist | null> {
    return this.wishlistsRepo.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async updateOne(
    id: number,
    dto: UpdateWishlistDto,
  ): Promise<Wishlist | null> {
    const wishlist = await this.findById(id);
    if (!wishlist) return null;
    if (dto.itemsId) {
      wishlist.items = dto.itemsId.length
        ? await this.wishesRepo.findBy({ id: In(dto.itemsId) })
        : [];
    }
    Object.assign(wishlist, {
      name: dto.name ?? wishlist.name,
      description: dto.description ?? wishlist.description,
      image: dto.image ?? wishlist.image,
    });
    return this.wishlistsRepo.save(wishlist);
  }

  async removeOne(id: number): Promise<Wishlist | null> {
    const wishlist = await this.findById(id);
    if (!wishlist) return null;
    await this.wishlistsRepo.remove(wishlist);
    return wishlist;
  }
}
