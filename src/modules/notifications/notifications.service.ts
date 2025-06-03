import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getUnreadNotificationCount(userId: number): Promise<number> {
    return this.notificationRepository.count({ where: { user: { id: userId }, is_read: false } });
  }

  async getAllNotifications(userId: number) {
    return this.notificationRepository.find({ where: { user: { id: userId } } });
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({ where: { id, user: { id: userId } } });
    if (!notification) {
      throw new Error('Notification not found or access denied');
    }
    await this.notificationRepository.update(id, { is_read: true });
  }

  async getUnreadNotifications(userId: number) {
    return this.notificationRepository.find({ where: { user: { id: userId }, is_read: false } });
  }
}