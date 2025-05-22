import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Subcategory } from '../subcategories/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryFeatureModule {}
