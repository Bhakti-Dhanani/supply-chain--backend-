import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RecordStockMovementDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  movementType: string;
}
