import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { ProductModule } from '../products/product.module';
import { NotificationModule } from '../notifications/notification.module';
import { SocketModule } from '../../common/gateway/socket.module';
import { NotificationService } from '../notifications/notification.service';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { LocationModule } from '../location/location.module';
import { Location } from '../location/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, Warehouse, Location]),
    ProductModule,
    NotificationModule,
    SocketModule,
    LocationModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, NotificationService],
})
export class OrderModule {}
