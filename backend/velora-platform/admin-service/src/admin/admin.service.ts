import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HotelService } from '../hotel/hotel.service';
import { RoomService } from '../room/room.service';

@Injectable()
export class AdminService {
  private USER_SERVICE = 'http://localhost:3001/users';
  private RESERVATION_SERVICE = 'http://localhost:3004/reservations';

  constructor(
    private hotelService: HotelService,
    private roomService: RoomService,
  ) {}

  async getDashboardStats() {
    try {
      const [usersRes, reservationsRes, hotels, rooms] = await Promise.all([
        axios.get(`${this.USER_SERVICE}/count`),
        axios.get(`${this.RESERVATION_SERVICE}/stats`),
        this.hotelService.findAll(),
        this.roomService.findAll(),
      ]);

      return {
        totalUsers: usersRes.data,
        totalReservations: reservationsRes.data.total,
        confirmedReservations: reservationsRes.data.confirmed,
        cancelledReservations: reservationsRes.data.cancelled,
        totalHotels: hotels.length,
        totalRooms: rooms.length,
      };
    } catch (error) {
      console.error('Dashboard error:', error.message);

      return {
        totalUsers: 0,
        totalReservations: 0,
        confirmedReservations: 0,
        cancelledReservations: 0,
        totalHotels: 0,
        totalRooms: 0,
      };
    }
  }
}