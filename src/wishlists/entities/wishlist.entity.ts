import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity({ name: 'wishlist', schema: 'kupipodariday' })
@Check(`char_length(name) BETWEEN 1 AND 250`)
@Check(`char_length(description) <= 1500`)
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  name: string;

  @Column({ length: 1500, nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable({
    name: 'wishlist_items',
    joinColumn: { name: 'wishlist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'wish_id', referencedColumnName: 'id' },
  })
  items: Wish[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
