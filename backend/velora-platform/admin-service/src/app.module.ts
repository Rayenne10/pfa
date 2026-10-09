import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HotelModule } from './hotel/hotel.module';
import { Hotel } from './hotel/hotel.entity';
import { RoomModule } from './room/room.module';
import { Room } from './room/room.entity';
import { AdminModule } from './admin/admin.module';
import { MetricsController } from './metrics/metrics.controller';
@Module({
  imports: [
    // Gestion des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Connexion PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5433,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Hotel, Room],
      synchronize: true,
    }),
    AdminModule,
    HotelModule,
    RoomModule,
  ],
   controllers: [MetricsController],
})
export class AppModule {}