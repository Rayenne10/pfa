import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/users.module';
import { User } from './user/user.entity';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'root',
      password: 'root',
      database: 'user_db',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [MetricsController],
})
export class AppModule {}