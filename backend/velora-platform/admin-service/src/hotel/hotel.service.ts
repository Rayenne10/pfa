import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Hotel } from './hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepo: Repository<Hotel>,
  ) {}

  async create(dto: CreateHotelDto) {
    const hotel = this.hotelRepo.create(dto);
    return this.hotelRepo.save(hotel);
  }

async findAll() {
  return this.hotelRepo.find();
}

  async findOne(id: number) {
    const hotel = await this.hotelRepo.findOne({ where: { id } });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async update(id: number, dto: UpdateHotelDto) {
    await this.hotelRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
  await this.hotelRepo.update(id, {
    deletedAt: new Date(),
  });

  return { message: 'Hotel deleted successfully' };
}
  async restore(id: number) {
  await this.hotelRepo.update(id, {
    deletedAt: null,
  });

  return { message: 'Hotel restored successfully' };
}
async countHotels() {
  return this.hotelRepo.count();
}
}