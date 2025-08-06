import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Check,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'offer', schema: 'kupipodariday' })
@Check(`amount >= 0`)
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ default: false })
    hidden: boolean;

    @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
    item: Wish;

    @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
