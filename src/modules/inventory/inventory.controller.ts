import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  getAllInventory() {
    return this.inventoryService.getAllInventory();
  }

  @Post()
  addInventory(@Body() addInventoryDto: any) {
    return this.inventoryService.addInventory(addInventoryDto);
  }

  @Put(':id')
  updateInventory(@Param('id') id: number, @Body() updateInventoryDto: any) {
    return this.inventoryService.updateInventory(id, updateInventoryDto);
  }
}
