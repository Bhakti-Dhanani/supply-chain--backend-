import { Module } from '@nestjs/common';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentStatusHistory } from '../shipment-status-history/shipment-status-history.entity';
import { TransporterModule } from '../transporters/transporter.module';
import { VehicleModule } from '../vehicles/vehicle.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment, ShipmentStatusHistory]),
    TransporterModule,
    VehicleModule,
    UserModule, // Add UserModule to imports
  ],
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule {}
