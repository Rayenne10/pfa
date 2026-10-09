import { CreateHotelDto } from "./create-hotel.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}