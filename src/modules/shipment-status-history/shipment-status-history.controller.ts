import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ShipmentStatusHistoryService } from './shipment-status-history.service';

@Controller('shipments/:id/status-history')
export class ShipmentStatusHistoryController {
  constructor(private readonly shipmentStatusHistoryService: ShipmentStatusHistoryService) {}

  @Get()
  getStatusHistory(@Param('id') shipmentId: number) {
    return this.shipmentStatusHistoryService.getStatusHistory(shipmentId);
  }

  @Post()
  addStatusHistory(@Param('id') shipmentId: number, @Body() addStatusHistoryDto: any) {
    return this.shipmentStatusHistoryService.addStatusHistory(shipmentId, addStatusHistoryDto);
  }
}
