import { Controller, Get, Param, Post, Body, Put, BadRequestException } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get(':id')
  async getShipmentDetails(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid ID parameter. ID must be an integer.');
    }
    return this.shipmentService.getShipmentDetails(parsedId);
  }

  @Post()
  createShipment(@Body() createShipmentDto: any) {
    return this.shipmentService.createShipment(createShipmentDto);
  }

  @Put(':id')
  updateShipmentStatus(@Param('id') id: number, @Body() updateShipmentStatusDto: any) {
    return this.shipmentService.updateShipmentStatus(id, updateShipmentStatusDto);
  }

  @Post('create')
  async createShipmentWithVehicleSelection(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentService.createShipmentWithVehicleSelection(createShipmentDto);
  }

  @Get()
  async getAllShipments() {
    return this.shipmentService.getAllShipments();
  }

  @Get('assigned')
  async getAssignedShipments() {
    return this.shipmentService.getAllShipments();
  }
}
