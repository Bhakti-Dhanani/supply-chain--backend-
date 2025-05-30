import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  getAllNotifications() {
    return this.notificationRepository.find();
  }

  markAsRead(id: number) {
    return this.notificationRepository.update(id, { is_read: true });
  }

  // Updated method to fetch notifications for multiple user IDs
  getNotificationsForUsers(userIds: number[]) {
    return this.notificationRepository.find({ where: { user: { id: In(userIds) } } });
  }
}
