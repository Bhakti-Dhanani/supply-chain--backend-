import { Module } from '@nestjs/common';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentStatusHistory } from '../shipment-status-history/shipment-status-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, ShipmentStatusHistory])],
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule {}
