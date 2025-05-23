import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { StockMovementModule } from '../stock-movements/stock-movement.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), StockMovementModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
