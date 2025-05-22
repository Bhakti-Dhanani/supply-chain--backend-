import { Controller, Get, Post, Body } from '@nestjs/common';
import { VehicleLogService } from './vehicle-log.service';

@Controller('vehicle-logs')
export class VehicleLogController {
  constructor(private readonly vehicleLogService: VehicleLogService) {}

  @Get()
  getAllLogs() {
    return this.vehicleLogService.getAllLogs();
  }

  @Post()
  addLog(@Body() addLogDto: any) {
    return this.vehicleLogService.addLog(addLogDto);
  }
}
