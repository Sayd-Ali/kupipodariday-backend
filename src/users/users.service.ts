import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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
    return this.repo.findOne({ where: filter, relations: ['wishes','offers','wishlists'] });
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

  async removeOne(filter: FindOptionsWhere<User>): Promise<User | null> {
    const user = await this.repo.findOne({ where: filter });
    if (!user) return null;
    await this.repo.remove(user);
    return user;
  }
}
