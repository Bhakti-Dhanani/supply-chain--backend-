import { Controller, Get, Query, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query('warehouseId') warehouseId: number) {
    return this.productService.getProductsByWarehouse(warehouseId);
  }

  @Post()
  @Roles('Manager', 'Admin')
  createProduct(@Body() createProductDto: any, @User() user: any) {
    console.log('User creating product:', user);
    return this.productService.createProduct({ ...createProductDto, createdBy: user.id });
  }

  @Put(':id')
  @Roles('Manager')
  updateProduct(@Param('id') id: number, @Body() updateProductDto: any) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @Roles('Manager')
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get('warehouse/:warehouseId')
  async getProductsByWarehouse(
    @Param('warehouseId') warehouseId: number,
    @Query('categoryId') categoryId?: number,
    @Query('subcategoryId') subcategoryId?: number,
  ) {
    return this.productService.getProductsByWarehouse(warehouseId, categoryId, subcategoryId);
  }
}
