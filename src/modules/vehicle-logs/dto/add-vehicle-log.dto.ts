import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddVehicleLogDto {
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  note: string;
}
