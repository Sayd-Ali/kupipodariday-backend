import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
      @InjectRepository(Wish)
      private wishesRepo: Repository<Wish>,
      @InjectRepository(User)
      private usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateWishDto): Promise<Wish> {
    const owner = await this.usersRepo.findOneBy({ id: dto.ownerId });
    if (!owner) throw new BadRequestException('Owner not found');
    const { ownerId, ...data } = dto;
    const wish = this.wishesRepo.create({ ...data, owner });
    return this.wishesRepo.save(wish);
  }

  findOne(filter: FindOptionsWhere<Wish>): Promise<Wish | null> {
    return this.wishesRepo.findOne({ where: filter, relations: ['owner', 'offers'] });
  }

  async updateOne(
      filter: FindOptionsWhere<Wish>,
      dto: UpdateWishDto,
  ): Promise<Wish | null> {
    const wish = await this.wishesRepo.findOne({ where: filter, relations: ['owner', 'offers'] });
    if (!wish) return null;
    Object.assign(wish, dto);
    if (dto.ownerId && dto.ownerId !== wish.owner.id) {
      const owner = await this.usersRepo.findOneBy({ id: dto.ownerId });
      if (owner) wish.owner = owner;
    }
    return this.wishesRepo.save(wish);
  }

  async removeOne(filter: FindOptionsWhere<Wish>): Promise<Wish | null> {
    const wish = await this.wishesRepo.findOneBy(filter);
    if (!wish) return null;
    await this.wishesRepo.remove(wish);
    return wish;
  }
}
