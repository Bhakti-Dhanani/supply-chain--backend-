import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { TransporterModule } from '../transporters/transporter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    TransporterModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService, TypeOrmModule], // Export TypeOrmModule
})
export class VehicleModule {}
