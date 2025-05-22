import { Controller, Get, Query, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('products')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query('warehouseId') warehouseId: number) {
    return this.productService.getProductsByWarehouse(warehouseId);
  }

  @Post()
  @Roles('Manager')
  createProduct(@Body() createProductDto: any) {
    return this.productService.createProduct(createProductDto);
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
}
