import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSubcategoryDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
