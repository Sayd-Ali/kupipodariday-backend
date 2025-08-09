import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
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

  async create(dto: CreateOfferDto & { userId: number }): Promise<Offer> {
    const wish = await this.wishesRepo.findOne({
      where: { id: dto.itemId },
      relations: ['owner'],
    });
    if (!wish) throw new BadRequestException('Подарок не найден');
    if (wish.owner.id === dto.userId)
      throw new ForbiddenException('Вы не можете скидываться на свой подарок');

    const price = Number(wish.price);
    const raised = Number(wish.raised);
    if (raised >= price)
      throw new BadRequestException('На подарок уже собрана нужная сумма');

    const available = +(price - raised).toFixed(2);
    if (dto.amount > available) {
      throw new BadRequestException(
        `Сумма превышает остаток до цели. Доступно: ${available}`,
      );
    }

    const user = await this.usersRepo.findOneBy({ id: dto.userId });
    if (!user) throw new BadRequestException('Пользователь не найден');

    const offer = this.offersRepo.create({
      amount: dto.amount,
      hidden: dto.hidden ?? false,
      item: wish,
      user,
    });

    wish.raised = +(raised + dto.amount).toFixed(2);
    await this.wishesRepo.save(wish);

    return this.offersRepo.save(offer);
  }

  async find(filter: any = {}): Promise<Offer[] | Offer | null> {
    if (filter.id) filter.id = +filter.id;

    if (Object.keys(filter).length === 1 && filter.id) {
      return this.offersRepo.findOne({
        where: { id: filter.id },
        relations: ['item', 'user'],
      });
    }

    return this.offersRepo.find({ where: filter, relations: ['item', 'user'] });
  }
}
