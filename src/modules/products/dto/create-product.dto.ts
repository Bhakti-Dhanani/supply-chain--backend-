import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  subcategoryId: number;

  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;
}
