import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(createOrderDto: { vendorId: number; items: { productId: number; quantity: number }[] }) {
    const order = this.orderRepository.create({
      vendor: { id: createOrderDto.vendorId },
      status: OrderStatus.PENDING,
      total_amount: 0, // Calculate total amount based on items
    });
    await this.orderRepository.save(order);

    const orderItems = createOrderDto.items.map((item) =>
      this.orderItemRepository.create({
        order,
        product: { id: item.productId },
        quantity: item.quantity,
        price: 0, // Fetch product price and calculate
      }),
    );
    await this.orderItemRepository.save(orderItems);

    return { orderId: order.id, status: order.status, estimatedDelivery: '2025-05-25' };
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateOrderStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.getOrderById(id);
    order.status = updateOrderStatusDto.status;
    return this.orderRepository.save(order);
  }

  async cancelOrder(id: number): Promise<void> {
    const order = await this.getOrderById(id);
    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);
  }
}
