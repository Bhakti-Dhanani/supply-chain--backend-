import { IsNotEmpty, IsNumber } from 'class-validator';

export class SetReorderAlertDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @IsNotEmpty()
  @IsNumber()
  threshold: number;
}
