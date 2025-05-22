import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Subcategory } from '../subcategories/subcategory.entity';

@Controller('categories')
@UseGuards(RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    return this.categoryService.getCategoriesWithSubcategories();
  }

  @Post()
  createCategory(@Body() createCategoryDto: any) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Put(':id')
  @Roles('Manager')
  updateCategory(@Param('id') id: number, @Body() updateCategoryDto: any) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles('Manager')
  deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }

  @Post(':id/subcategories')
  @Roles('Admin', 'Manager')
  createSubcategory(
    @Param('id') categoryId: number,
    @Body() createSubcategoryDto: { name: string; description: string },
  ) {
    return this.categoryService.createSubcategory(categoryId, createSubcategoryDto);
  }

  @Put(':categoryId/subcategories/:subcategoryId')
  @Roles('Admin', 'Manager')
  updateSubcategory(
    @Param('categoryId') categoryId: number,
    @Param('subcategoryId') subcategoryId: number,
    @Body() updateSubcategoryDto: { name?: string; description?: string },
  ) {
    return this.categoryService.updateSubcategory(categoryId, subcategoryId, updateSubcategoryDto);
  }

  @Delete(':categoryId/subcategories/:subcategoryId')
  @Roles('Admin', 'Manager')
  deleteSubcategory(
    @Param('categoryId') categoryId: number,
    @Param('subcategoryId') subcategoryId: number,
  ) {
    return this.categoryService.deleteSubcategory(categoryId, subcategoryId);
  }
}
