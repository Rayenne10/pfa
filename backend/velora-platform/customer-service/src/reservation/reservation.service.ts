import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { differenceInDays } from 'date-fns';
import axios from 'axios';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private repo: Repository<Reservation>,
  ) {}

  private ROOM_SERVICE_URL = 'http://localhost:3003/admin/rooms';
  private HOTEL_SERVICE_URL = 'http://localhost:3003/admin/hotels';
  private USER_SERVICE_URL = 'http://localhost:3001/users';

  async create(dto: CreateReservationDto) {
    // 1️⃣ Vérifier l'utilisateur
    const userResponse = await axios.get(`${this.USER_SERVICE_URL}/${dto.userId}`);

    if (!userResponse.data) {
      throw new BadRequestException('User does not exist');
    }

    // 2️⃣ Vérifier l'hôtel
    try {
    const hotelResponse = await axios.get(`${this.HOTEL_SERVICE_URL}/${dto.hotelId}`);
    } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new BadRequestException('Hotel does not exist');
    }
    throw err;
  }
    try {
    const roomsResponse = await axios.get(`${this.ROOM_SERVICE_URL}/${dto.roomId}`);
    } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new BadRequestException('Room does not exist');
    }
    throw err;
  }

    // 3️⃣ Vérifier la chambre et qu’elle appartient bien à l’hôtel
    const roomResponse = await axios.get(`${this.ROOM_SERVICE_URL}/${dto.roomId}`);
    const room = roomResponse.data;
    if (!room) {
      throw new BadRequestException('Room does not exist');
    }
    if (room.hotelId !== dto.hotelId) {
      throw new BadRequestException('Room does not belong to this hotel');
    }

    // 4️⃣ Vérifier disponibilité
    const isAvailable = await this.checkAvailability(dto.roomId, dto.startDate, dto.endDate);
    if (!isAvailable) {
      throw new BadRequestException('Room not available');
    }

    // 5️⃣ Calculer le prix
    const days = differenceInDays(new Date(dto.endDate), new Date(dto.startDate));
    const totalPrice = days * room.price;

    // 6️⃣ Créer la réservation
    const reservation = this.repo.create({ ...dto, totalPrice });
    return this.repo.save(reservation);
  }

  async checkAvailability(roomId: number, start: string, end: string) {
    try {
    const roomsResponse = await axios.get(`${this.ROOM_SERVICE_URL}/${roomId}`);
    } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new BadRequestException('Room does not exist');
    }
    throw err;
  }
    const overlapping = await this.repo
      .createQueryBuilder('reservation')
      .where('reservation.roomId = :roomId', { roomId })
      .andWhere('reservation.status = :status', {
        status: 'confirmed',
      })
      .andWhere(
        '(reservation.startDate <= :end AND reservation.endDate >= :start)',
        { start, end },
      )
      .getCount();

    return overlapping === 0;
  }

  async findAvailableRooms(start: string, end: string, hotelId: number) {
  // 1️⃣ Récupérer toutes les réservations qui se chevauchent
  const reservedRooms = await this.repo
    .createQueryBuilder('reservation')
    .select('reservation.roomId', 'roomId')
    .where('(reservation.startDate <= :end AND reservation.endDate >= :start)', { start, end })
    .andWhere('reservation.status = :status', { status: 'confirmed' })
    .getRawMany();

  const reservedIds = reservedRooms.map(r => r.roomId);

  // 2️⃣ Récupérer toutes les chambres depuis le Room Service
  const roomsResponse = await axios.get(`${this.ROOM_SERVICE_URL}`);
  const allRooms = roomsResponse.data;

  // 3️⃣ Filtrer les chambres disponibles
  const availableRooms = allRooms.filter(room => !reservedIds.includes(Number(room.id)) && room.hotelId === hotelId);

  return availableRooms;
}

  async cancel(id: number) {
    return this.repo.update(id, {
      status: ReservationStatus.CANCELLED,
    });
  }

  async findByUser(userId: number) {
    const userResponse = await axios.get(`${this.USER_SERVICE_URL}/${userId}`);

    if (!userResponse.data) {
      throw new BadRequestException('User does not exist');
    }
    return this.repo.find({ where: { userId } });
  }

  async findByHotel(hotelId: number) {
    try {
    const hotelResponse = await axios.get(`${this.HOTEL_SERVICE_URL}/${hotelId}`);
    } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new BadRequestException('Hotel does not exist');
    }
    throw err;
  }
    return this.repo.find({ where: { hotelId } });
  }
  async findById(id: number): Promise<Reservation> {
    const reservation = await this.repo.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  async findByRoom(roomId: number) {
    try {    const roomsResponse = await axios.get(`${this.ROOM_SERVICE_URL}/${roomId}`);
    } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new BadRequestException('Room does not exist');
    } throw err;
  } 
    return this.repo.find({ where: { roomId } });
  }
  
  async getStats() {
  const total = await this.repo.count();

  const confirmed = await this.repo.count({
    where: { status: ReservationStatus.CONFIRMED },
  });

  const cancelled = await this.repo.count({
    where: { status: ReservationStatus.CANCELLED },
  });

  return {
    total,
    confirmed,
    cancelled,
  };
}
}