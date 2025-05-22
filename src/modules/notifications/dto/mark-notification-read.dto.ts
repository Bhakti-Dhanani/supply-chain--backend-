import { IsNotEmpty, IsBoolean } from 'class-validator';

export class MarkNotificationReadDto {
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;
}
