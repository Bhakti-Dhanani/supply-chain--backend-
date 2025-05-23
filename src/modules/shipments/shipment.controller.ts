import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { ShipmentService } from './shipment.service';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get(':id')
  async getShipmentDetails(@Param('id') id: number) {
    return this.shipmentService.getShipmentDetails(id);
  }

  @Post()
  createShipment(@Body() createShipmentDto: any) {
    return this.shipmentService.createShipment(createShipmentDto);
  }

  @Put(':id')
  updateShipmentStatus(@Param('id') id: number, @Body() updateShipmentStatusDto: any) {
    return this.shipmentService.updateShipmentStatus(id, updateShipmentStatusDto);
  }
}
