import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(dto: CreateWishDto, ownerId: number): Promise<Wish> {
    const owner = await this.usersRepo.findOneBy({ id: ownerId });
    if (!owner) throw new BadRequestException('Owner not found');

    const wish = this.wishesRepo.create({
      ...dto,
      owner,
      raised: 0,
    });
    return this.wishesRepo.save(wish);
  }

  async findOneById(id: number, viewerId?: number): Promise<Wish> {
    const wish = await this.wishesRepo.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) throw new NotFoundException('Wish not found');

    if (!viewerId || wish.owner.id !== viewerId) {
      wish.offers = (wish.offers ?? []).filter((o) => !o.hidden);
    }
    return wish;
  }

  async updateProtectedWish(
    id: number,
    dto: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.findOneById(id);
    if (wish.owner.id !== userId)
      throw new ForbiddenException('Можно редактировать только свои желания!');

    if ('price' in dto && wish.offers && wish.offers.length > 0) {
      throw new BadRequestException(
        'Нельзя менять стоимость, уже есть желающие!',
      );
    }
    if ('raised' in dto) delete dto.raised;
    Object.assign(wish, dto);
    return this.wishesRepo.save(wish);
  }

  async removeProtectedWish(id: number, userId: number): Promise<Wish> {
    const wish = await this.findOneById(id);
    if (wish.owner.id !== userId)
      throw new ForbiddenException('Можно удалять только свои желания!');
    await this.wishesRepo.remove(wish);
    return wish;
  }

  async getLast(): Promise<Wish[]> {
    return this.wishesRepo.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner'],
    });
  }

  async getTop(): Promise<Wish[]> {
    return this.wishesRepo.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: ['owner'],
    });
  }

  async copyWish(id: number, userId: number): Promise<Wish> {
    const original = await this.findOneById(id, userId);
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    original.copied += 1;
    await this.wishesRepo.save(original);

    const copy = this.wishesRepo.create({
      name: original.name,
      link: original.link,
      image: original.image,
      price: original.price,
      description: original.description,
      owner: user,
      raised: 0,
    });
    return this.wishesRepo.save(copy);
  }
}
