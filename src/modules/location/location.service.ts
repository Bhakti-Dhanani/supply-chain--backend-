import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { convertAddressToGeocoordinates } from '../../utils/address-to-geocoordinates';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async createLocation(address: { house: string; street: string; city: string; state: string; country: string }) {
    // First, create the location with address only (lat/lon null)
    let location = this.locationRepository.create({ ...address, latitude: null, longitude: null });
    location = await this.locationRepository.save(location);
    // Now, fetch geocoordinates and update the same record
    const { latitude, longitude } = await convertAddressToGeocoordinates(address);
    if (latitude !== null && longitude !== null) {
      location.latitude = latitude;
      location.longitude = longitude;
      location = await this.locationRepository.save(location);
    }
    return location;
  }

  async updateLocationGeocoordinates(locationId: number): Promise<Location> {
    const location = await this.locationRepository.findOne({ where: { id: locationId } });
    if (!location) throw new Error('Location not found');
    const { latitude, longitude } = await convertAddressToGeocoordinates({
      house: location.house,
      street: location.street,
      city: location.city,
      state: location.state,
      country: location.country,
    });
    location.latitude = latitude;
    location.longitude = longitude;
    return this.locationRepository.save(location);
  }
}
