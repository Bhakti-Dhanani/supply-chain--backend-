import { Module } from '@nestjs/common';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subcategory])],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
})
export class SubcategoryModule {}
