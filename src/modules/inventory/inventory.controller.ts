import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { getRepository } from 'typeorm';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';
import { Product } from '../products/product.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('warehouse')
  @UseGuards(JwtAuthGuard)
  async getInventoryForUserWarehouses(
    @User() user: { id: number; role: string },
    @Query('categoryId') categoryId?: string,
    @Query('subcategoryId') subcategoryId?: string,
    @Query('search') search?: string
  ) {
    // Find all warehouses managed by this user
    const warehouseManagerRepo = getRepository(WarehouseManager);
    const managerLinks = await warehouseManagerRepo.find({ where: { user: { id: user.id } }, relations: ['assigned_warehouse'] });
    const warehouseIds = managerLinks.map((wm) => wm.assigned_warehouse?.id).filter(Boolean);
    if (!warehouseIds.length) return [];

    // Build product query
    const productRepo = getRepository(Product);
    let query = productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subcategory', 'subcategory')
      .leftJoinAndSelect('product.warehouse', 'warehouse')
      .where('product.warehouse IN (:...warehouseIds)', { warehouseIds });
    if (categoryId) query = query.andWhere('category.id = :categoryId', { categoryId });
    if (subcategoryId) query = query.andWhere('subcategory.id = :subcategoryId', { subcategoryId });
    if (search) query = query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    const products = await query.getMany();
    // Format for frontend
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.quantity,
      warehouseName: p.warehouse?.name,
      categoryName: p.category?.name,
      subcategoryName: p.subcategory?.name,
    }));
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
