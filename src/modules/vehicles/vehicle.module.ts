import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { TransporterModule } from '../transporters/transporter.module';
import { TransporterController } from '../transporters/transporter.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    forwardRef(() => TransporterModule), // Import TransporterModule to provide TransporterService
  ],
  controllers: [VehicleController, TransporterController],
  providers: [VehicleService],
  exports: [VehicleService, TypeOrmModule],
})
export class VehicleModule {}
