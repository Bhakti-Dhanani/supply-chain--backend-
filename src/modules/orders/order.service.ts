import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './order.entity';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { SocketGateway } from '../../common/gateway/socket.gateway';
import { Notification } from '../notifications/notification.entity';
import { User } from '../users/user.entity';
import { LocationService } from '../location/location.service';
import { Location } from '../location/location.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly socketGateway: SocketGateway,
    private readonly locationService: LocationService,
  ) {}

  async createOrder(user: User, createOrderDto: { warehouseId: number; items: { productId: number; quantity: number }[]; house: string; street: string; city: string; state: string; country: string }) {
    // Use the user from the token as the vendor
    const vendor = await this.orderRepository.manager.findOne('User', { where: { id: user.id } });
    if (!vendor) throw new Error('Vendor user not found');
    // Fetch the warehouse and manager
    const warehouse = await this.warehouseRepository.findOne({ where: { id: createOrderDto.warehouseId }, relations: ['manager'] });
    if (!warehouse) throw new Error('Warehouse not found');
    const manager = warehouse.manager;
    // Create order
    const order = this.orderRepository.create({
      vendor: vendor,
      status: OrderStatus.PENDING,
      total_amount: 0,
    });
    await this.orderRepository.save(order);

    let total = 0;
    const orderItems: OrderItem[] = [];
    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (!product) throw new Error(`Product with id ${item.productId} not found`);
      const price = Number(product.price);
      const orderItem = this.orderItemRepository.create({
        order,
        product,
        quantity: item.quantity,
        price,
      });
      total += price * item.quantity;
      orderItems.push(orderItem);
    }
    await this.orderItemRepository.save(orderItems);
    order.total_amount = total;
    await this.orderRepository.save(order);

    // Create and save location
    const location = await this.locationService.createLocation({
      house: createOrderDto.house,
      street: createOrderDto.street,
      city: createOrderDto.city,
      state: createOrderDto.state,
      country: createOrderDto.country,
    });
    // After creating the location, associate it with the order
    order.location = location;
    await this.orderRepository.save(order);

    // Send real-time notification to the warehouse manager
    if (manager && manager.id) {
      const message = `A new order (#${order.id}) has been created for your warehouse.`;
      // Save notification in DB
      await this.notificationRepository.save({
        user: manager,
        message,
        type: 'order_created',
        is_read: false,
      });
      // Send real-time notification
      this.socketGateway.sendNotificationToUser(manager.id, {
        type: 'order_created',
        orderId: order.id,
        message,
      });
    }

    return { orderId: order.id, status: order.status, total: order.total_amount, estimatedDelivery: '2025-05-25' };
  }

  async getOrderById(id: number): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['location'] });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    let latitude: number | null = null;
    let longitude: number | null = null;
    if (order.location) {
      latitude = order.location.latitude;
      longitude = order.location.longitude;
    }
    return {
      id: order.id,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      location: order.location ? {
        house: order.location.house,
        street: order.location.street,
        city: order.location.city,
        state: order.location.state,
        country: order.location.country,
        latitude,
        longitude
      } : null
    };
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
