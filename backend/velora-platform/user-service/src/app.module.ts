import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/users.module';
import { User } from './user/user.entity';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'velora',
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || 'user_db',
      entities: [User],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    UsersModule,
  ],
  controllers: [MetricsController],
})
export class AppModule {}
