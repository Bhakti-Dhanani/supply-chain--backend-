import { Controller, Get, Put, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getAllNotifications() {
    return this.notificationService.getAllNotifications();
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: number) {
    return this.notificationService.markAsRead(id);
  }
}
