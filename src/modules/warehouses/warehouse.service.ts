import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { User } from '../users/user.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WarehouseManager)
    private readonly warehouseManagerRepository: Repository<WarehouseManager>,
  ) {}

  async createWarehouse(createWarehouseDto: any, user: { id: number; role: string }) {
    // Validate that the user has the 'Manager' role
    if (!user || !user.role) {
      throw new UnauthorizedException('User information is missing or incomplete.');
    }

    if (user.role !== 'Manager') {
      throw new UnauthorizedException('Only users with the Manager role can create warehouses.');
    }

    try {
      // Create the warehouse and assign the managerId
      const warehouse = this.warehouseRepository.create({
        ...createWarehouseDto,
        manager: { id: user.id },
      });
      const savedWarehouse = (await this.warehouseRepository.save(warehouse)) as unknown as Warehouse;

      // Link the warehouse with the warehouse-managers table
      const warehouseManager = this.warehouseManagerRepository.create({
        user: { id: user.id },
        assigned_warehouse: savedWarehouse,
      });
      await this.warehouseManagerRepository.save(warehouseManager);

      return savedWarehouse;
    } catch (error) {
      console.error('Error creating warehouse:', error.message);
      throw new InternalServerErrorException('Warehouse creation failed: ' + error.message);
    }
  }

  async getWarehouseById(id: number) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found.`);
    }
    return warehouse;
  }

  async updateWarehouse(id: number, updateWarehouseDto: any) {
    const warehouse = await this.getWarehouseById(id);
    Object.assign(warehouse, updateWarehouseDto);
    return this.warehouseRepository.save(warehouse);
  }

  async deleteWarehouse(id: number) {
    const warehouse = await this.getWarehouseById(id);
    await this.warehouseRepository.remove(warehouse);
    return { message: `Warehouse with ID ${id} deleted successfully.` };
  }
}
