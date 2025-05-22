import { Controller, Get, Post, Body } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';

@Controller('stock-movements')
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Get()
  getAllStockMovements() {
    return this.stockMovementService.getAllStockMovements();
  }

  @Post()
  recordStockMovement(@Body() recordStockMovementDto: any) {
    return this.stockMovementService.recordStockMovement(recordStockMovementDto);
  }
}
