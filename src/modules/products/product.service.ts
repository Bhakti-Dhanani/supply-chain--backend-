import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: Repository<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createProduct(createProductDto: any) {
    const { name, warehouseId, quantity, categoryId, subcategoryId, ...rest } = createProductDto;

    // Validate categoryId
    const category = await this.productRepository.manager.findOne(Category, { where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Validate subcategoryId
    const subcategory = await this.productRepository.manager.findOne(Subcategory, { where: { id: subcategoryId } });
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${subcategoryId} not found`);
    }

    // Check if a product with the same name and warehouse ID exists
    const existingProduct = await this.productRepository.findOne({
      where: { name, warehouse: { id: warehouseId } },
    });

    if (existingProduct) {
      // Increment the quantity of the existing product
      existingProduct.quantity += quantity;
      const updatedProduct = await this.productRepository.save(existingProduct);

      // Emit an event instead of directly calling StockMovementService
      this.eventEmitter.emit('product.updated', { product: updatedProduct, quantity });

      return updatedProduct;
    }

    // Validate warehouseId
    const warehouse = await this.productRepository.manager.findOne(Warehouse, { where: { id: warehouseId } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

    // Create and save a new product
    const product = this.productRepository.create({
      name,
      warehouse,
      quantity,
      category,
      subcategory,
      ...rest,
    });
    const savedProduct = await this.productRepository.save(product);

    // Emit an event instead of directly calling StockMovementService
    this.eventEmitter.emit('product.created', { product: savedProduct, quantity });

    return savedProduct;
  }

  async getProductsByWarehouse(warehouseId: number) {
    return this.productRepository.find({
      where: { warehouse: { id: warehouseId } },
      relations: ['category', 'subcategory', 'warehouse'],
    });
  }

  async getAllProducts() {
    return this.productRepository.find();
  }

  async getProductById(id: number) {
    return this.productRepository.findOne({ where: { id } });
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
