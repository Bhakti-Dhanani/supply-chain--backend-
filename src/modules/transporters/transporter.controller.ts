import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransporterService } from './transporter.service';

@Controller('transporters')
export class TransporterController {
  constructor(private readonly transporterService: TransporterService) {}

  @Get()
  getAllTransporters() {
    return this.transporterService.getAllTransporters();
  }

  @Post('register')
  registerTransporter(@Body() registerTransporterDto: any) {
    return this.transporterService.registerTransporter(registerTransporterDto);
  }

  @Get('vehicles')
  async fetchTransportersWithVehicles() {
    return this.transporterService.getTransportersWithVehicles();
  }

  @Get(':id/user')
  async getUserIdByTransporterId(@Param('id') transporterId: number) {
    return this.transporterService.getUserIdByTransporterId(transporterId);
  }
}
