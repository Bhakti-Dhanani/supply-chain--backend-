import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { StockMovementModule } from '../stock-movements/stock-movement.module';
import { WarehouseModule } from '../warehouses/warehouse.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([Product])),
    forwardRef(() => StockMovementModule),
    forwardRef(() => WarehouseModule),
    DatabaseModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'PRODUCT_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(Product),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
