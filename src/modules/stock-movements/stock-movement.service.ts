import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement } from './stock-movement.entity';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
  ) {}

  getAllStockMovements() {
    return this.stockMovementRepository.find();
  }

  recordStockMovement(recordStockMovementDto: any) {
    const stockMovement = this.stockMovementRepository.create(recordStockMovementDto);
    return this.stockMovementRepository.save(stockMovement);
  }
}
