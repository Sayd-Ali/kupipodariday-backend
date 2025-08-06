import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNumber,
    Min,
    IsOptional,
    IsBoolean,
    IsInt,
    IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
    @ApiProperty({
        example: 2500.50,
        description: 'Сумма заявки (неотрицательное число, до двух знаков после запятой)',
    })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount: number;

    @ApiPropertyOptional({
        example: false,
        description: 'Скрыть оффер от посторонних (по умолчанию false)',
    })
    @IsBoolean()
    @IsOptional()
    hidden?: boolean;

    @ApiProperty({
        example: 123,
        description: 'ID подарка (wish), на который делается оффер',
    })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    itemId: number;

    @ApiProperty({
        example: 456,
        description: 'ID пользователя, делающего оффер',
    })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    userId: number;
}
