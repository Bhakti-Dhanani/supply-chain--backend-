import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WarehouseProduct } from './warehouse-product.entity';

@Injectable()
export class WarehouseProductService {
  constructor(
    @Inject('WAREHOUSE_PRODUCT_REPOSITORY')
    private readonly warehouseProductRepository: Repository<WarehouseProduct>,
  ) {}

 
  
}
