import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  sku: string;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.id)
  subcategory: Subcategory;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  warehouse: Warehouse;

  @CreateDateColumn()
  created_at: Date;
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query('warehouseId') warehouseId: number) {
    return this.productService.getProductsByWarehouse(warehouseId);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
