import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { RoomType } from 'src/enums/room-type.enum';

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsNumber()
  hotelId: number;

  @IsEnum(RoomType)
  type: RoomType;

  @IsNumber()
  capacity: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  features?: string[];
}