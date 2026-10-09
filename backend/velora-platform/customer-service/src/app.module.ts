import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Reservation } from './reservation/reservation.entity';
import { ReservationModule } from './reservation/reservation.module';
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
      host: process.env.DB_HOST || 'postgres',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'velora',
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || 'customer_db',
      entities: [Reservation],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),

    ReservationModule,
  ],
  controllers: [MetricsController],
})
export class AppModule {}
