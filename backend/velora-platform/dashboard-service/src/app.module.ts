import { MetricsController } from './metrics/metrics.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  controllers: [MetricsController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DashboardModule,
  ],
})
export class AppModule {}
