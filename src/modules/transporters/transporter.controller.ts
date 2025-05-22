import { Controller, Get, Post, Body } from '@nestjs/common';
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
}
