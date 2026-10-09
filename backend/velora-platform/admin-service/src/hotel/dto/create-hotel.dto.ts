import { IsString, IsOptional } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  description?: string;
}