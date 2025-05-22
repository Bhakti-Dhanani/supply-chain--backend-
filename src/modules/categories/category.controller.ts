import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

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
}
