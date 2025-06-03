import { Module, forwardRef } from '@nestjs/common';
import { StockMovementController } from './stock-movement.controller';
import { StockMovementService } from './stock-movement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovement } from './stock-movement.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockMovement, WarehouseManager]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [StockMovementController],
  providers: [StockMovementService],
  exports: [StockMovementService],
})
export class StockMovementModule {}
