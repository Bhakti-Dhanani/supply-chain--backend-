import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { VendorModule } from './modules/vendors/vendor.module';
import { TransporterModule } from './modules/transporters/transporter.module';
import { ProductModule } from './modules/products/product.module';
import { OrderModule } from './modules/orders/order.module';
import { ShipmentModule } from './modules/shipments/shipment.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { AuditLogModule } from './modules/audit-logs/audit-log.module';
import { VehicleLogModule } from './modules/vehicle-logs/vehicle-log.module';
import { ReorderAlertModule } from './modules/reorder-alerts/reorder-alert.module';
import { StockMovementModule } from './modules/stock-movements/stock-movement.module';
import { CategoryModule } from './modules/categories/category.module';
import { SubcategoryModule } from './modules/subcategories/subcategory.module';
import { User } from './modules/users/user.entity';
import { Vendor } from './modules/vendors/vendor.entity';
import { Transporter } from './modules/transporters/transporter.entity';
import { WarehouseManager } from './modules/warehouse-managers/warehouse-manager.entity';
import { Category } from './modules/categories/category.entity';
import { Subcategory } from './modules/subcategories/subcategory.entity';
import { Product } from './modules/products/product.entity';
import { Warehouse } from './modules/warehouses/warehouse.entity';
import { Inventory } from './modules/inventory/inventory.entity';
import { StockMovement } from './modules/stock-movements/stock-movement.entity';
import { ReorderAlert } from './modules/reorder-alerts/reorder-alert.entity';
import { Order } from './modules/orders/order.entity';
import { OrderItem } from './modules/order-items/order-item.entity';
import { Shipment } from './modules/shipments/shipment.entity';
import { ShipmentStatusHistory } from './modules/shipment-status-history/shipment-status-history.entity';
import { Vehicle } from './modules/vehicles/vehicle.entity';
import { VehicleLog } from './modules/vehicle-logs/vehicle-log.entity';
import { Notification } from './modules/notifications/notification.entity';
import { File } from './modules/files/file.entity';
import { AuditLog } from './modules/audit-logs/audit-log.entity';
import { WarehouseProduct } from './modules/warehouse-products/warehouse-product.entity';
import { WarehouseModule } from './modules/warehouses/warehouse.module';
import { Location } from './modules/location/location.entity';
import { WarehouseLocation } from './modules/warehouse-locations/warehouse-location.entity';
import { WarehouseLocationModule } from './modules/warehouse-locations/warehouse-location.module';
import { VehicleModule } from './modules/vehicles/vehicle.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
      entities: [
        User,
        Vendor,
        Transporter,
        WarehouseManager,
        Category,
        Subcategory,
        Product,
        Warehouse,
        Inventory,
        StockMovement,
        ReorderAlert,
        Order,
        OrderItem,
        Shipment,
        ShipmentStatusHistory,
        Vehicle,
        VehicleLog,
        Notification,
        File,
        AuditLog,
        WarehouseProduct,
        Location,
        WarehouseLocation,
      ],
    }),
    AuthModule,
    UserModule,
    VendorModule,
    TransporterModule,
    ProductModule,
    OrderModule,
    ShipmentModule,
    InventoryModule,
    NotificationModule,
    AuditLogModule,
    VehicleLogModule,
    ReorderAlertModule,
    StockMovementModule,
    CategoryModule,
    SubcategoryModule,
    WarehouseModule, // Ensure WarehouseModule is included
    WarehouseLocationModule,
    VehicleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
