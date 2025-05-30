import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { Product } from '../products/product.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Product, WarehouseManager])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
