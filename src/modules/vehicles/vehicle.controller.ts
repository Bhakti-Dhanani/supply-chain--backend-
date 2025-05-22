import { Controller, Get, Post, Body } from '@nestjs/common';
import { VehicleService } from './vehicle.service';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  getAllVehicles() {
    return this.vehicleService.getAllVehicles();
  }

  @Post()
  registerVehicle(@Body() registerVehicleDto: any) {
    return this.vehicleService.registerVehicle(registerVehicleDto);
  }
}
