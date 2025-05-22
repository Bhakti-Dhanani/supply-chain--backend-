import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class RegisterWarehouseManagerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  warehouseName?: string;
}
