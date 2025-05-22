import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  getAllVehicles() {
    return this.vehicleRepository.find();
  }

  registerVehicle(registerVehicleDto: any) {
    const vehicle = this.vehicleRepository.create(registerVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }
}
