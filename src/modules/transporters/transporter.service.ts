import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transporter } from './transporter.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

@Injectable()
export class TransporterService {
  constructor(
    @InjectRepository(Transporter)
    private readonly transporterRepository: Repository<Transporter>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  getAllTransporters() {
    return this.transporterRepository.find();
  }

  registerTransporter(registerTransporterDto: any) {
    const transporter = this.transporterRepository.create(registerTransporterDto);
    return this.transporterRepository.save(transporter);
  }

  async getTransportersWithVehicles() {
    const transporters = await this.transporterRepository.find({ relations: ['user'] });

    const transporterDetails = await Promise.all(
      transporters.map(async (transporter) => {
        const userId = transporter.user.id; // Fetch userId from the user relation
        const vehicles = await this.vehicleRepository.find({ where: { transporter: { id: transporter.id } } });

        return {
          id: transporter.id,
          userId, // Include userId in the response
          transporterName: transporter.user.name, // Fetch transporter name from Users table
          vehicles: vehicles.map((vehicle) => ({
            id: vehicle.id, // Include vehicle ID in the response
            type: vehicle.type,
            plateNumber: vehicle.plate_number, // Ensure plate_number is included
          })),
        };
      }),
    );

    return transporterDetails;
  }

  async getUserIdByTransporterId(transporterId: number): Promise<number> {
    const transporter = await this.transporterRepository.findOne({ where: { id: transporterId }, relations: ['user'] });
    if (!transporter || !transporter.user) {
      throw new NotFoundException(`User not found for transporter ID ${transporterId}`);
    }
    return transporter.user.id;
  }
}
