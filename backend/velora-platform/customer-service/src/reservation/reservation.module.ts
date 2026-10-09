import { Module, Res } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.entity';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ReservationController],
  providers: [ReservationService, JwtStrategy],
})
export class ReservationModule {}