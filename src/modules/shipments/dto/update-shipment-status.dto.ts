import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShipmentStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}
