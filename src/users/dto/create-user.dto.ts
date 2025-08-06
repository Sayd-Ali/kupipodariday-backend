import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsEmail,
    IsUrl,
    Length,
    MinLength,
    MaxLength,
    IsOptional,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example: 'john_doe',
        description: 'Уникальное имя пользователя (2–30 символов)',
    })
    @IsString()
    @Length(2, 30)
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Pa$$w0rd!', description: 'Пароль пользователя' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({
        example: 'Люблю путешествовать и читать книги',
        description: 'Немного о себе (2–200 символов)',
    })
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    @IsOptional()
    about?: string;

    @ApiPropertyOptional({
        example: 'https://example.com/avatar.jpg',
        description: 'URL аватара пользователя',
    })
    @IsUrl()
    @IsOptional()
    avatar?: string;
}
