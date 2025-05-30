import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';

@Controller('stock-movements')
export class StockMovementController {
  constructor(
    private readonly stockMovementService: StockMovementService,
    @InjectRepository(WarehouseManager)
    private readonly warehouseManagerRepository: Repository<WarehouseManager>,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllStockMovementsForUser(
    @User() user: { id: number; role: string },
    @Query('warehouseId') warehouseId?: string
  ) {
    // Use injected repository instead of getRepository
    const managerLinks = await this.warehouseManagerRepository.find({ where: { user: { id: user.id } }, relations: ['assigned_warehouse'] });
    let warehouseIds = managerLinks.map((wm) => wm.assigned_warehouse?.id).filter((id): id is number => typeof id === 'number');
    if (warehouseId) {
      warehouseIds = warehouseIds.filter((id) => String(id) === String(warehouseId));
    }
    if (!warehouseIds.length) return [];
    // Use query builder to support array of warehouse IDs
    return this.stockMovementService.getStockMovementsByWarehouseIdsQB(warehouseIds);
  }

  @Post()
  recordStockMovement(@Body() recordStockMovementDto: any) {
    return this.stockMovementService.recordStockMovement(recordStockMovementDto);
  }
}
