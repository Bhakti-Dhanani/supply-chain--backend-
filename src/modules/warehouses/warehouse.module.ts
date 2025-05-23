import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { Warehouse } from './warehouse.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseLocationModule } from '../warehouse-locations/warehouse-location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, WarehouseManager]),
    UserModule,
    WarehouseLocationModule,
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
