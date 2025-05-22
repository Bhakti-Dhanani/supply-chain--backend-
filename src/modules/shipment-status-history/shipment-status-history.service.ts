import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentStatusHistory } from './shipment-status-history.entity';

@Injectable()
export class ShipmentStatusHistoryService {
  constructor(
    @InjectRepository(ShipmentStatusHistory)
    private readonly shipmentStatusHistoryRepository: Repository<ShipmentStatusHistory>,
  ) {}

  getStatusHistory(shipmentId: number) {
    return this.shipmentStatusHistoryRepository.find({ where: { shipment: { id: shipmentId } } });
  }

  addStatusHistory(shipmentId: number, addStatusHistoryDto: any) {
    const statusHistory = this.shipmentStatusHistoryRepository.create({
      ...addStatusHistoryDto,
      shipment: { id: shipmentId },
    });
    return this.shipmentStatusHistoryRepository.save(statusHistory);
  }
}
