import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Category } from './category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSubcategoryDto } from '../subcategories/dto/create-subcategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async getCategoriesWithSubcategories() {
    const categories = await this.categoryRepository.find();
    const subcategories = await this.subcategoryRepository.find();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      subcategories: subcategories.filter((sub) => sub.category.id === category.id),
    }));
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: number, updateCategoryDto: any): Promise<UpdateResult> {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async deleteCategory(id: number): Promise<DeleteResult> {
    return this.categoryRepository.delete(id);
  }

  async createSubcategory(categoryId: number, createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new Error('Category not found');
    }
    const subcategory = this.subcategoryRepository.create({ ...createSubcategoryDto, category });
    return this.subcategoryRepository.save(subcategory);
  }

  async updateSubcategory(categoryId: number, subcategoryId: number, updateSubcategoryDto: any): Promise<UpdateResult> {
    const subcategory = await this.subcategoryRepository.findOne({ where: { id: subcategoryId, category: { id: categoryId } } });
    if (!subcategory) {
      throw new Error('Subcategory not found');
    }
    return this.subcategoryRepository.update(subcategoryId, updateSubcategoryDto);
  }

  async deleteSubcategory(categoryId: number, subcategoryId: number): Promise<DeleteResult> {
    const subcategory = await this.subcategoryRepository.findOne({ where: { id: subcategoryId, category: { id: categoryId } } });
    if (!subcategory) {
      throw new Error('Subcategory not found');
    }
    return this.subcategoryRepository.delete(subcategoryId);
  }
}
