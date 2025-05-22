import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Shipment } from '../shipments/shipment.entity';

export enum Status {
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  DELAYED = 'Delayed',
}

@Entity('shipment_status_history')
export class ShipmentStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shipment, (shipment) => shipment.id)
  shipment: Shipment;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @CreateDateColumn()
  timestamp: Date;

  @Column('text')
  location_notes: string;
}
