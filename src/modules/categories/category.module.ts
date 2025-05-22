import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
