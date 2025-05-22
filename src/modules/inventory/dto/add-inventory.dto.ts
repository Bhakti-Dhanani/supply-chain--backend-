import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
