import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('subcategories')
@UseGuards(RolesGuard)
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Get()
  getAllSubcategories() {
    return this.subcategoryService.getAllSubcategories();
  }

  @Post()
  createSubcategory(@Body() createSubcategoryDto: any) {
    return this.subcategoryService.createSubcategory(createSubcategoryDto);
  }

  @Put(':id')
  @Roles('Manager')
  updateSubcategory(@Param('id') id: number, @Body() updateSubcategoryDto: any) {
    return this.subcategoryService.updateSubcategory(id, updateSubcategoryDto);
  }

  @Delete(':id')
  @Roles('Manager')
  deleteSubcategory(@Param('id') id: number) {
    return this.subcategoryService.deleteSubcategory(id);
  }
}
