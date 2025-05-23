import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLocation } from './warehouse-location.entity';
import { WarehouseLocationService } from './warehouse-location.service';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseLocation])],
  providers: [WarehouseLocationService],
  exports: [TypeOrmModule, WarehouseLocationService],
})
export class WarehouseLocationModule {}
