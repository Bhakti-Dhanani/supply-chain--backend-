import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  getAllInventory() {
    return this.inventoryRepository.find();
  }

  addInventory(addInventoryDto: any) {
    const inventory = this.inventoryRepository.create(addInventoryDto);
    return this.inventoryRepository.save(inventory);
  }

  updateInventory(id: number, updateInventoryDto: any) {
    return this.inventoryRepository.update(id, updateInventoryDto);
  }
}
