import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { User } from '../users/user.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity';
import { WarehouseLocationService } from '../warehouse-locations/warehouse-location.service';
import { CreateWarehouseLocationDto } from '../warehouse-locations/dto/create-warehouse-location.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WarehouseManager)
    private readonly warehouseManagerRepository: Repository<WarehouseManager>,
    private readonly warehouseLocationService: WarehouseLocationService,
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
      // Extract address fields for warehouse location
      const address: CreateWarehouseLocationDto = {
        house: createWarehouseDto.house,
        street: createWarehouseDto.street,
        city: createWarehouseDto.city,
        state: createWarehouseDto.state,
        country: createWarehouseDto.country,
      };
      // Remove address fields from warehouse payload
      const { house, street, city, state, country, ...warehouseFields } = createWarehouseDto;
      // Create warehouse location and get the location ID
      const locationId = await this.warehouseLocationService.createAndGetLocationId(address);
      // Create the warehouse and assign the managerId and location ID
      const warehouse = this.warehouseRepository.create({
        ...warehouseFields,
        location: { id: locationId },
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

    // Delete related entries in the warehouse-managers table
    await this.warehouseManagerRepository.delete({ assigned_warehouse: { id } });

    await this.warehouseRepository.remove(warehouse);
    return { message: `Warehouse with ID ${id} deleted successfully.` };
  }
}
