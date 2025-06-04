import { Module, forwardRef } from '@nestjs/common';
import { TransporterController } from './transporter.controller';
import { TransporterService } from './transporter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transporter } from './transporter.entity';
import { VehicleModule } from '../vehicles/vehicle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transporter]),
    forwardRef(() => VehicleModule), // Use forwardRef to resolve circular dependency
  ],
  controllers: [TransporterController],
  providers: [TransporterService],
  exports: [TransporterService, TypeOrmModule], // Export TransporterService
})
export class TransporterModule {}
