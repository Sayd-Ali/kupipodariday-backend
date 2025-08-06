import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { HashModule } from 'src/hash/hash.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'student',
    database: 'kupipodariday',
    schema: 'kupipodariday',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), HashModule, AuthModule, UsersModule, WishesModule, WishlistsModule, OffersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
