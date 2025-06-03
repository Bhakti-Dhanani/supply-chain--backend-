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

  async getStockMovementsByWarehouseIds(warehouseIds: number[]) {
    if (!warehouseIds.length) return [];
    return this.stockMovementRepository.createQueryBuilder('stock_movement')
      .leftJoinAndSelect('stock_movement.product', 'product')
      .leftJoinAndSelect('stock_movement.warehouse', 'warehouse')
      .where('stock_movement.warehouse IN (:...warehouseIds)', { warehouseIds })
      .orderBy('stock_movement.created_at', 'DESC')
      .getMany();
  }

  async getStockMovementsByWarehouseIdsQB(warehouseIds: number[]) {
    if (!warehouseIds.length) return [];
    return this.stockMovementRepository.createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product')
      .leftJoinAndSelect('movement.warehouse', 'warehouse')
      .where('movement.warehouse IN (:...warehouseIds)', { warehouseIds })
      .orderBy('movement.created_at', 'DESC')
      .getMany();
  }
}
