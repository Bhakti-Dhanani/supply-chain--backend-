import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { ProductModule } from '../products/product.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SocketModule } from '../../common/gateway/socket.module';
import { NotificationsService } from '../notifications/notifications.service';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { LocationModule } from '../location/location.module';
import { Location } from '../location/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, Warehouse, Location]),
    ProductModule,
    NotificationsModule,
    SocketModule,
    LocationModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, NotificationsService],
})
export class OrderModule {}
