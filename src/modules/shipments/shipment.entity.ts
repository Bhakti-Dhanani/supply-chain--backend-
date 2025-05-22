import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Transporter } from '../transporters/transporter.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

export enum ShipmentStatus {
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  DELAYED = 'Delayed',
}

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @ManyToOne(() => Transporter, (transporter) => transporter.id)
  transporter: Transporter;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  vehicle: Vehicle;

  @Column({ type: 'enum', enum: ShipmentStatus })
  status: ShipmentStatus;

  @CreateDateColumn()
  created_at: Date;
}
