import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { Warehouse } from './warehouse.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseLocationModule } from '../warehouse-locations/warehouse-location.module';
import { ProductModule } from '../products/product.module';
import { User } from '../users/user.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([Warehouse, WarehouseManager])),
    UserModule,
    WarehouseLocationModule,
    forwardRef(() => ProductModule),
    DatabaseModule,
  ],
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    {
      provide: 'WAREHOUSE_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(Warehouse),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(User),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'WAREHOUSE_MANAGER_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(WarehouseManager),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [WarehouseService],
})
export class WarehouseModule {}
