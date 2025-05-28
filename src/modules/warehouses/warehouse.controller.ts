import { Controller, Post, Body, Get, Put, Delete, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { User } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createWarehouse(
    @Body() createWarehouseDto: any,
    @User() user: { id: number; role: string },
  ) {
    console.log('User object in controller after guard:', user);
    return this.warehouseService.createWarehouse(createWarehouseDto, user);
  }

  @Get()
  async getAllWarehouses() {
    return this.warehouseService.getAllWarehouses();
  }

  @Get(':id')
  async getWarehouseById(@Param('id') id: number) {
    return this.warehouseService.getWarehouseById(id);
  }

  @Put(':id')
  async updateWarehouse(@Param('id') id: number, @Body() updateWarehouseDto: any) {
    return this.warehouseService.updateWarehouse(id, updateWarehouseDto);
  }

  @Delete(':id')
  async deleteWarehouse(@Param('id') id: number) {
    return this.warehouseService.deleteWarehouse(id);
  }
}
