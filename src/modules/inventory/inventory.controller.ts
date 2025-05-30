import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('warehouse')
  @UseGuards(JwtAuthGuard)
  async getInventoryForUserWarehouses(
    @User() user: { id: number; role: string },
    @Query('categoryId') categoryId?: string,
    @Query('subcategoryId') subcategoryId?: string,
    @Query('search') search?: string,
    @Query('warehouseId') warehouseId?: string
  ) {
    // Use dependency-injected repositories via InventoryService, not getRepository (which requires a global connection)
    return this.inventoryService.getInventoryForUserWarehouses({
      userId: user.id,
      categoryId,
      subcategoryId,
      search,
      warehouseId,
    });
  }

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
