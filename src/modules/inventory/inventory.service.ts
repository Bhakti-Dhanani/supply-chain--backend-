import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { Product } from '../products/product.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';
import { StockMovementService } from '../stock-movements/stock-movement.service';
import { MovementType } from '../stock-movements/stock-movement.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(WarehouseManager)
    private readonly warehouseManagerRepository: Repository<WarehouseManager>,
    private readonly stockMovementService: StockMovementService,
  ) {}

  getAllInventory() {
    return this.inventoryRepository.find();
  }

  async addInventory(addInventoryDto: any) {
    const inventory = this.inventoryRepository.create(addInventoryDto);
    const savedInventory = await this.inventoryRepository.save(inventory);

    // Record stock movement
    await this.stockMovementService.recordStockMovement({
      product: addInventoryDto.productId,
      warehouse: addInventoryDto.warehouseId,
      quantity: addInventoryDto.quantity,
      movement_type: MovementType.IN,
    });

    // Update product stock
    await this.productRepository.increment({ id: addInventoryDto.productId }, 'stock', addInventoryDto.quantity);

    return savedInventory;
  }

  updateInventory(id: number, updateInventoryDto: any) {
    return this.inventoryRepository.update(id, updateInventoryDto);
  }

  async getInventoryForUserWarehouses({ userId, categoryId, subcategoryId, search, warehouseId }: {
    userId: number,
    categoryId?: string,
    subcategoryId?: string,
    search?: string,
    warehouseId?: string,
  }) {
    // Find all warehouses managed by this user
    const managerLinks = await this.warehouseManagerRepository.find({ where: { user: { id: userId } }, relations: ['assigned_warehouse'] });
    let warehouseIds = managerLinks.map((wm) => wm.assigned_warehouse?.id).filter(Boolean);
    if (warehouseId) {
      warehouseIds = warehouseIds.filter((id) => String(id) === String(warehouseId));
    }
    if (!warehouseIds.length) return [];
    // Build product query
    let query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subcategory', 'subcategory')
      .leftJoinAndSelect('product.warehouse', 'warehouse')
      .where('product.warehouse IN (:...warehouseIds)', { warehouseIds });
    if (categoryId) query = query.andWhere('category.id = :categoryId', { categoryId });
    if (subcategoryId) query = query.andWhere('subcategory.id = :subcategoryId', { subcategoryId });
    if (search) query = query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    const products = await query.getMany();
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.quantity,
      warehouseName: p.warehouse?.name,
      categoryName: p.category?.name,
      subcategoryName: p.subcategory?.name,
    }));
  }
}
