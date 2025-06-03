import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentStatusHistory } from '../shipment-status-history/shipment-status-history.entity';
import { Transporter } from '../transporters/transporter.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { User } from '../users/user.entity'; // Import User entity
import { UserRole } from '../users/user.entity'; // Import UserRole enum


@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(ShipmentStatusHistory)
    private readonly statusHistoryRepository: Repository<ShipmentStatusHistory>,
    @InjectRepository(Transporter)
    private readonly transporterRepository: Repository<Transporter>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User) // Inject User repository
    private readonly userRepository: Repository<User>,
  ) {}

  async getShipmentDetails(id: number) {
    const shipment = await this.shipmentRepository.findOne({ where: { id }, relations: ['transporter', 'vehicle'] });
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return {
      id: shipment.id,
      orderId: shipment.order.id,
      transporter: shipment.transporter?.id, // Updated to use transporter ID instead of company_name
      vehicle: shipment.vehicle?.plate_number,
      routeLog: [], // Add route log if available
      statusHistory: [], // Add status history if available
    };
  }

  async createShipment(createShipmentDto: CreateShipmentDto) {
    // Implement logic to create a shipment
  }

  async updateShipmentStatus(id: number, updateShipmentStatusDto: UpdateShipmentStatusDto) {
    // Implement logic to update shipment status
  }

  async createShipmentWithVehicleSelection(createShipmentDto: CreateShipmentDto) {
    const { orderId, vehicleId } = createShipmentDto;

    // Fetch user role as Transporter
    const user = await this.userRepository.findOne({ where: { id: createShipmentDto.userId }, relations: ['role'] });
    if (!user || user.role !== UserRole.TRANSPORTER) {
      throw new NotFoundException(`User with ID ${createShipmentDto.userId} is not a Transporter`);
    }

    // Validate vehicle
    const vehicle = await this.vehicleRepository.findOne({ where: { id: Number(vehicleId), transporter: { id: user.id } } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found for transporter ID ${user.id}`);
    }

    // Create shipment
    const shipment = this.shipmentRepository.create({
      order: { id: orderId },
      transporter: user,
      vehicle,
    });

    return this.shipmentRepository.save(shipment);
  }
}
