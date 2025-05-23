import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateLocationDto {
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

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
