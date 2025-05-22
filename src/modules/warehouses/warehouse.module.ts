import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { Warehouse } from './warehouse.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, WarehouseManager]),
    UserModule,
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
