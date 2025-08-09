import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsOptional,
  IsUrl,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishDto {
  @ApiProperty({
    example: 'Новая игровая консоль',
    description: 'Название подарка (1–250 символов)',
  })
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiPropertyOptional({
    example: 'https://example.com/console',
    description: 'Ссылка на товар',
  })
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiProperty({
    example: 'https://example.com/images/console.jpg',
    description: 'URL изображения подарка',
  })
  @IsString()
  @IsUrl()
  image: string;

  @ApiProperty({
    example: 29999.99,
    description: 'Стоимость подарка (до двух знаков после запятой)',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'Последняя модель с поддержкой VR',
    description: 'Описание подарка (1–1024 символа)',
  })
  @IsString()
  @Length(1, 1024)
  description: string;
}
