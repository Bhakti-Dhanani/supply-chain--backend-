import { Controller, Get, Param } from '@nestjs/common';
import { WarehouseProductService } from './warehouse-product.service';

@Controller('warehouse-products')
export class WarehouseProductController {
  constructor(private readonly warehouseProductService: WarehouseProductService) {}

 
}
