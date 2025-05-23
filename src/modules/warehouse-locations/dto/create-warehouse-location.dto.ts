import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseLocationDto {
  @IsNotEmpty()
  @IsString()
  house: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
