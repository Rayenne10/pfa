import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { HotelModule } from '../hotel/hotel.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [HotelModule, RoomModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}