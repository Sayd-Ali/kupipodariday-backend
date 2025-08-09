import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  async findOne(filter: FindOptionsWhere<User>): Promise<User | null> {
    if (!filter || Object.keys(filter).length === 0) {
      return null;
    }
    return this.repo.findOne({
      where: filter,
      relations: ['wishes', 'offers', 'wishlists'],
    });
  }

  async findMany(query: string): Promise<User[]> {
    return this.repo.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
  }

  async updateOne(
    filter: FindOptionsWhere<User>,
    dto: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this.repo.findOne({ where: filter });
    if (!user) return null;
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async getWishesByUserId(userId: number) {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: [
        'wishes',
        'wishes.owner',
        'wishes.offers',
        'wishes.offers.user',
      ],
    });
    return user?.wishes ?? [];
  }

  async getWishesByUsername(username: string) {
    const user = await this.repo.findOne({
      where: { username },
      relations: [
        'wishes',
        'wishes.owner',
        'wishes.offers',
        'wishes.offers.user',
      ],
    });
    if (!user) return [];
    user.wishes.forEach((w) => {
      w.offers = (w.offers ?? []).filter((o) => !o.hidden);
    });
    return user.wishes;
  }
}
