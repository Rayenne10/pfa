import { Module } from '@nestjs/common';
import { Room } from './room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Hotel } from 'src/hotel/hotel.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Hotel]), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [RoomController],
  providers: [RoomService, JwtStrategy],
  exports: [RoomService],
})
export class RoomModule {}