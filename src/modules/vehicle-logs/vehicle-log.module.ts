import { Module } from '@nestjs/common';
import { VehicleLogController } from './vehicle-log.controller';
import { VehicleLogService } from './vehicle-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleLog } from './vehicle-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleLog])],
  controllers: [VehicleLogController],
  providers: [VehicleLogService],
})
export class VehicleLogModule {}
