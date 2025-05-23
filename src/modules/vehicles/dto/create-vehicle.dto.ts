import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  plate_number: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  // Add other optional or required fields as needed
}
