import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseProduct } from './warehouse-product.entity';
import { WarehouseProductController } from './warehouse-product.controller';
import { WarehouseProductService } from './warehouse-product.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([WarehouseProduct])),
  ],
  controllers: [WarehouseProductController],
  providers: [
    WarehouseProductService,
    {
      provide: 'WAREHOUSE_PRODUCT_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(WarehouseProduct),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [WarehouseProductService],
})
export class WarehouseProductModule {}
