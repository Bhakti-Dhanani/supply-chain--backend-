import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductsByWarehouse(warehouseId: number) {
    return this.productRepository.find({ where: { warehouse: { id: warehouseId } } });
  }

  async getAllProducts() {
    return this.productRepository.find();
  }

  async getProductById(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  async createProduct(createProductDto: any) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async updateProduct(id: number, updateProductDto: any) {
    await this.productRepository.update(id, updateProductDto);
    return this.productRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: number) {
    await this.productRepository.delete(id);
    return { deleted: true };
  }
}

import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Post()
  createProduct(@Body() createProductDto: any) {
    return this.productService.createProduct(createProductDto);
  }

  @Put(':id')
  updateProduct(@Param('id') id: number, @Body() updateProductDto: any) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
