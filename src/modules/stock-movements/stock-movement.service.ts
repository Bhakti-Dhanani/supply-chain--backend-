import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StockMovement } from './stock-movement.entity';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  getAllStockMovements() {
    return this.stockMovementRepository.find();
  }

  async recordStockMovement(recordStockMovementDto: any) {
    const stockMovement = this.stockMovementRepository.create(recordStockMovementDto);
    const savedStockMovement = await this.stockMovementRepository.save(stockMovement);

    // Emit an event after recording the stock movement
    this.eventEmitter.emit('stockMovement.recorded', savedStockMovement);

    return savedStockMovement;
  }
}
