import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseManager } from './warehouse-manager.entity';

@Injectable()
export class WarehouseManagerService {
  constructor(
    @InjectRepository(WarehouseManager)
    private readonly warehouseManagerRepository: Repository<WarehouseManager>,
  ) {}

  getAllManagers() {
    return this.warehouseManagerRepository.find();
  }

  assignManager(assignManagerDto: any) {
    const manager = this.warehouseManagerRepository.create(assignManagerDto);
    return this.warehouseManagerRepository.save(manager);
  }
}
