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
}
