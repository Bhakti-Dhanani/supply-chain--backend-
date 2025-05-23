import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { User } from '../../common/decorators/user.decorator';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  getAllVehicles() {
    return this.vehicleService.getAllVehicles();
  }

  @Post()
  @Roles('Transporter', 'Admin')
  registerVehicle(@Body() registerVehicleDto: CreateVehicleDto, @User() user: any) {
    const transporterId = user.transporterId; // Extract transporterId from the token
    return this.vehicleService.registerVehicle({ ...registerVehicleDto, transporterId }, user.id);
  }
}
