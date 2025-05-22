import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  vendorId: number;

  @IsNotEmpty()
  @IsArray()
  items: { productId: number; quantity: number }[];
}
