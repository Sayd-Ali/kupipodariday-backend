import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    Length,
    IsOptional,
    IsUrl,
    IsInt,
    IsPositive,
    IsArray,
    ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishlistDto {
    @ApiProperty({
        example: 'Подарки на Новый год',
        description: 'Название списка (1–250 символов)',
    })
    @IsString()
    @Length(1, 250)
    name: string;

    @ApiPropertyOptional({
        example: 'Собрал идеи для новогодних подарков друзьям',
        description: 'Описание списка (до 1500 символов)',
    })
    @IsString()
    @Length(0, 1500)
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        example: 'https://example.com/images/wishlist.jpg',
        description: 'URL обложки списка',
    })
    @IsUrl()
    @IsOptional()
    image?: string;

    @ApiProperty({
        example: 7,
        description: 'ID пользователя-владельца списка',
    })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    ownerId: number;

    @ApiPropertyOptional({
        type: [Number],
        example: [1, 2, 3],
        description: 'Массив ID подарков в списке',
    })
    @IsArray()
    @ArrayUnique()
    @Type(() => Number)
    @IsInt({ each: true })
    @IsPositive({ each: true })
    @IsOptional()
    itemIds?: number[];
}
