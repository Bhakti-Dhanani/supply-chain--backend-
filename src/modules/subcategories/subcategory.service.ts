import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  getAllSubcategories() {
    return this.subcategoryRepository.find({ relations: ['category'] });
  }

  createSubcategory(createSubcategoryDto: any) {
    const subcategory = this.subcategoryRepository.create(createSubcategoryDto);
    return this.subcategoryRepository.save(subcategory);
  }

  async updateSubcategory(id: number, updateSubcategoryDto: any): Promise<UpdateResult> {
    return this.subcategoryRepository.update(id, updateSubcategoryDto);
  }

  async deleteSubcategory(id: number): Promise<DeleteResult> {
    return this.subcategoryRepository.delete(id);
  }
}
