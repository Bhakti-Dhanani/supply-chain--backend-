import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RegisterTransporterDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsNumber()
  vehicleCount: number;
}
