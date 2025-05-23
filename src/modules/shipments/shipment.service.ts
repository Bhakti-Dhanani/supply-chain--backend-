import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentStatusHistory } from '../shipment-status-history/shipment-status-history.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';


@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(ShipmentStatusHistory)
    private readonly statusHistoryRepository: Repository<ShipmentStatusHistory>,
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
}
