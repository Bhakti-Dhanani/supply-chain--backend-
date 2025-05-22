import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard)
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
  async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: any, @User() user: { id: number; role: string }) {
    return this.categoryService.updateCategory(id, updateCategoryDto, user);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number, @User() user: { id: number; role: string }) {
    return this.categoryService.deleteCategory(id, user);
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
