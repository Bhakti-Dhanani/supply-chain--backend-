import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  getAllOrderItems(orderId: number) {
    return this.orderItemRepository.find({ where: { order: { id: orderId } } });
  }

  addOrderItem(orderId: number, addOrderItemDto: any) {
    const orderItem = this.orderItemRepository.create({
      ...addOrderItemDto,
      order: { id: orderId },
    });
    return this.orderItemRepository.save(orderItem);
  }
}
