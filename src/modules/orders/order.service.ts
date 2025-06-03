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
      const product = await this.productRepository.findOne({ where: { id: item.productId }, relations: ['warehouse'] });
      if (!product) throw new Error(`Product with id ${item.productId} not found`);
      const price = Number(product.price);
      const orderItem = this.orderItemRepository.create({
        order,
        product,
        quantity: item.quantity,
        price,
        warehouse: warehouse, // Save user-selected warehouse, not product.warehouse
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
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'location',
        'orderItems',
        'orderItems.product',
        'orderItems.product.warehouse',
        'orderItems.product.warehouse.manager',
        'orderItems.product.warehouse.location',
      ],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    let latitude: number | null = null;
    let longitude: number | null = null;
    if (order.location) {
      latitude = order.location.latitude;
      longitude = order.location.longitude;
    }
    // Get warehouse from the first order item's product
    let warehouse: Warehouse | null = null;
    if (order.orderItems && order.orderItems.length > 0) {
      const firstProduct = order.orderItems[0].product;
      if (firstProduct && firstProduct.warehouse) {
        warehouse = firstProduct.warehouse;
      }
    }
    const response: any = {
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
      } : null,
      items: order.orderItems?.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: item.product ? { id: item.product.id, name: item.product.name } : null,
        warehouse: item.warehouse ? {
          id: item.warehouse.id,
          name: item.warehouse.name,
          latitude: item.warehouse.location?.latitude || null,
          longitude: item.warehouse.location?.longitude || null
        } : null
      })) || [],
    };
    if (warehouse) {
      response.warehouse = {
        id: warehouse.id,
        name: warehouse.name,
        address: warehouse.location ? `${warehouse.location.house}, ${warehouse.location.street}, ${warehouse.location.city}, ${warehouse.location.state}, ${warehouse.location.country}` : '',
        latitude: warehouse.location?.latitude || null,
        longitude: warehouse.location?.longitude || null,
        manager: warehouse.manager ? { id: warehouse.manager.id, name: warehouse.manager.name } : null,
      };
    }
    return response;
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

  async getOrdersByVendor(vendorId: number): Promise<any[]> {
    const orders = await this.orderRepository.find({
      where: { vendor: { id: vendorId } },
      relations: [
        'location',
        'orderItems',
        'orderItems.product',
        'orderItems.product.warehouse',
        'orderItems.product.warehouse.manager',
      ],
      order: { created_at: 'DESC' },
    });
    return orders.map(order => {
      // Get warehouse from the first order item (assuming all items are from the same warehouse)
      const warehouse = order.orderItems?.[0]?.product?.warehouse;
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
          latitude: order.location.latitude,
          longitude: order.location.longitude,
        } : null,
        warehouse: warehouse ? {
          id: warehouse.id,
          name: warehouse.name,
          address: warehouse.location ? `${warehouse.location.house}, ${warehouse.location.street}, ${warehouse.location.city}, ${warehouse.location.state}, ${warehouse.location.country}` : '',
          manager: warehouse.manager ? { id: warehouse.manager.id, name: warehouse.manager.name } : null,
        } : null,
        items: order.orderItems?.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: item.product ? { id: item.product.id, name: item.product.name } : null,
        })) || [],
      };
    });
  }

  async getOrdersByWarehouseIds(warehouseIds: number[]): Promise<any[]> {
    if (!warehouseIds || warehouseIds.length === 0) return [];
    // Find all orders where any orderItem is associated with one of the given warehouses
    const orders = await this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.vendor', 'vendor')
      .leftJoinAndSelect('order.location', 'location')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .leftJoinAndSelect('orderItems.warehouse', 'warehouse')
      .where('orderItems.warehouse IN (:...warehouseIds)', { warehouseIds })
      .orderBy('order.created_at', 'DESC')
      .getMany();

    // Format for frontend
    return orders.map(order => {
      const warehouse = order.orderItems?.[0]?.warehouse;
      return {
        id: order.id,
        status: order.status,
        vendor: order.vendor ? { id: order.vendor.id, name: order.vendor.name } : null,
        total_amount: order.total_amount,
        created_at: order.created_at,
        location: order.location ? {
          house: order.location.house,
          street: order.location.street,
          city: order.location.city,
          state: order.location.state,
          country: order.location.country,
          latitude: order.location.latitude,
          longitude: order.location.longitude,
        } : null,
        warehouse: warehouse ? {
          id: warehouse.id,
          name: warehouse.name,
        } : null,
      };
    });
  }
}
