import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateWarehouseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}
