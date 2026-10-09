import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './hotel.entity';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { Room } from 'src/room/room.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, Room]), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [HotelController],
  providers: [HotelService, JwtStrategy],
  exports: [HotelService],
})
export class HotelModule {}