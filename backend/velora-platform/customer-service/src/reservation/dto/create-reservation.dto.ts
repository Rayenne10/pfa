import {
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  hotelId: number;

  @IsNumber()
  roomId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}