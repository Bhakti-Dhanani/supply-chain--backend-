import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Transporter } from '../transporters/transporter.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Transporter)
    private readonly transporterRepository: Repository<Transporter>,
  ) {}

  async registerVehicle(registerVehicleDto: any, userId: number) {
    const { plate_number, type, ...vehicleData } = registerVehicleDto;

    // Validate required fields
    if (!plate_number) {
      throw new BadRequestException('The plate_number field is required.');
    }
    if (!type) {
      throw new BadRequestException('The type field is required.');
    }

    // Check if a transporter exists for the userId
    let transporter = await this.transporterRepository.findOne({ where: { user: { id: userId } } });
    if (!transporter) {
      // Create a new transporter entry if it does not exist
      transporter = this.transporterRepository.create({ user: { id: userId }, vehicle_count: 1 });
      transporter = await this.transporterRepository.save(transporter);
    } else {
      // Increment vehicle count for the existing transporter
      transporter.vehicle_count += 1;
      await this.transporterRepository.save(transporter);
    }

    // Create and save the vehicle
    const vehicle = this.vehicleRepository.create({
      plate_number,
      type,
      ...vehicleData,
      transporter,
      user: { id: userId },
    });
    return this.vehicleRepository.save(vehicle);
  }

  getAllVehicles() {
    return this.vehicleRepository.find();
  }
}
