import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  ForbiddenException,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Roles } from 'src/guards/role.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RolesGuard } from 'src/guards/jwt.roles.guard';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('USER')
@Post()
create(@Body() dto: CreateReservationDto, @Req() req) {
  const userIdFromToken = req.user.sub;
  if (dto.userId !== userIdFromToken) {
    throw new ForbiddenException('You can only create reservations for yourself');
  }
  return this.service.create(dto);
}
 
  @Get('availability')
  checkAvailability(
    @Query('roomId') roomId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.service.checkAvailability(roomId, start, end);
  }

  @Get('available-rooms')
  getAvailableRooms(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('hotelId') hotelId: number,
  ) {
    return this.service.findAvailableRooms(start, end, hotelId);
  }
   
  @Get('stats')
getStats() {
  return this.service.getStats();
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
@Get('user/:userId')
async findByUser(@Param('userId') userId: number, @Req() req) {
  const currentUser = req.user; 
  if (currentUser.role !== 'ADMIN' && currentUser.sub !== +userId) {
    throw new ForbiddenException('You can only access your own reservations');
  }

  return this.service.findByUser(userId);
}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('hotel/:hotelId')
  findByHotel(@Param('hotelId') hotelId: number) {
    return this.service.findByHotel(hotelId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Get('room/:roomId')
  findbyRoom(@Param('roomId') roomId: number) {
    return this.service.findByRoom(roomId);
  }

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('USER', 'ADMIN')
@Patch(':id/cancel')
async cancel(@Param('id') id: number, @Req() req) {
  const currentUser = req.user;

  // Récupérer la réservation pour vérifier le propriétaire
  const reservation = await this.service.findById(id);
  if (!reservation) {
    throw new NotFoundException('Reservation not found');
  }

  if (currentUser.role !== 'ADMIN' && reservation.userId !== currentUser.sub) {
    throw new ForbiddenException('You can only cancel your own reservations');
  }

  return this.service.cancel(id);
}

@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Get(':id')
  async findById(@Param('id') id: number, @Req() req) {
    const reservation = await this.service.findById(id);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const currentUser = req.user;
    if (currentUser.role !== 'ADMIN' && reservation.userId !== currentUser.sub) {
      throw new ForbiddenException('You can only access your own reservation');
    }

    return reservation;
  }

}