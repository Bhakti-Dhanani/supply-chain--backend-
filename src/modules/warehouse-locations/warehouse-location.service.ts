import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseLocation } from './warehouse-location.entity';
import { convertAddressToGeocoordinates } from '../../utils/address-to-geocoordinates';

@Injectable()
export class WarehouseLocationService {
  constructor(
    @InjectRepository(WarehouseLocation)
    private readonly warehouseLocationRepository: Repository<WarehouseLocation>,
  ) {}

  async createWarehouseLocation(address: { house: string; street: string; city: string; state: string; country: string }) {
    let location = this.warehouseLocationRepository.create({ ...address, latitude: null, longitude: null });
    location = await this.warehouseLocationRepository.save(location);
    const { latitude, longitude } = await convertAddressToGeocoordinates(address);
    if (latitude !== null && longitude !== null) {
      location.latitude = latitude;
      location.longitude = longitude;
      location = await this.warehouseLocationRepository.save(location);
    }
    return location;
  }

  async createAndGetLocationId(address: { house: string; street: string; city: string; state: string; country: string }): Promise<number> {
    const location = await this.createWarehouseLocation(address);
    return location.id;
  }

  async getWarehouseLocationsWithUtilization() {
    return this.warehouseLocationRepository.query(`
      SELECT wl.id, wl.house, wl.street, wl.city, wl.state, wl.country,
             wp.total_capacity, wp.stock_available,
             ROUND((wp.stock_available / wp.total_capacity) * 100, 2) AS utilization
      FROM warehouse_locations wl
      JOIN warehouse_products wp ON wl.id = wp.warehouse_location_id
    `);
  }
}
