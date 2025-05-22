import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShipmentDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  transporterId: number;

  @IsNotEmpty()
  @IsString()
  vehicleId: string;
}
