import { Controller, Get, Patch, Req, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { CustomRequest } from '../../common/types/custom-request';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('unread-count')
  async getUnreadNotificationCount(@Req() req: CustomRequest) {
    if (!req.user) {
      throw new Error('User ID not found in token');
    }
    const userId = req.user.id;
    const count = await this.notificationsService.getUnreadNotificationCount(userId);
    const notifications = await this.notificationsService.getUnreadNotifications(userId);
    return { count, notifications };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllNotifications(@Req() req: CustomRequest) {
    if (!req.user) {
      throw new Error('User ID not found in token');
    }
    const userId = req.user.id;
    return this.notificationsService.getAllNotifications(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('mark-as-read/:id')
  async markNotificationAsRead(@Param('id') id: string, @Req() req: CustomRequest) {
    if (!req.user) {
      throw new Error('User ID not found in token');
    }
    const notificationId = +id;
    const userId = req.user.id;
    return this.notificationsService.markAsRead(notificationId, userId);
  }
}