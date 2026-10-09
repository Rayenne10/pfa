import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Hotel } from 'src/hotel/hotel.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>
  ) {}

  async create(createRoomDto: CreateRoomDto) {
  const { hotelId } = createRoomDto;

  const hotel = await this.hotelRepository.findOne({
    where: { id: hotelId },
  });

  if (!hotel) {
    throw new NotFoundException(`Hotel with ID ${hotelId} not found`);
  }

  const room = this.roomRepository.create(createRoomDto);
  return this.roomRepository.save(room);
}
  async findAll() {
    return this.roomRepository.find();
  }

  async findOne(id: number) {
    const room = await this.roomRepository.findOne({ where: { id } });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async findByHotel(hotelId: number) {
    return this.roomRepository.find({
      where: { hotelId },
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.findOne(id);

    Object.assign(room, updateRoomDto);

    return this.roomRepository.save(room);
  }

  async remove(id: number) {
    const room = await this.findOne(id);
    return this.roomRepository.softRemove(room);
  }
  async countRooms() {
  return this.roomRepository.count();
}
}