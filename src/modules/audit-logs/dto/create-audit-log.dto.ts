import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAuditLogDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  action: string;

  @IsNotEmpty()
  @IsString()
  entityType: string;

  @IsNotEmpty()
  @IsString()
  entityId: string;
}
