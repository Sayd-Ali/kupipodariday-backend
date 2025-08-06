import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Check,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity({ name: 'wish', schema: 'kupipodariday' })
@Check(`char_length(name) BETWEEN 1 AND 250`)
@Check(`char_length(description) BETWEEN 1 AND 1024`)
@Check(`copied >= 0`)
export class Wish {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 250 })
    name: string;

    @Column({ nullable: true })
    link?: string;

    @Column()
    image: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    raised: number;

    @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
    owner: User;

    @Column({ length: 1024 })
    description: string;

    @OneToMany(() => Offer, (offer) => offer.item)
    offers: Offer[];

    @Column({ type: 'int', default: 0 })
    copied: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
