import { Controller, Get, Post, Body } from '@nestjs/common';
import { WarehouseManagerService } from './warehouse-manager.service';

@Controller('warehouse-managers')
export class WarehouseManagerController {
  constructor(private readonly warehouseManagerService: WarehouseManagerService) {}

  @Get()
  getAllManagers() {
    return this.warehouseManagerService.getAllManagers();
  }

  @Post()
  assignManager(@Body() assignManagerDto: any) {
    return this.warehouseManagerService.assignManager(assignManagerDto);
  }
}
