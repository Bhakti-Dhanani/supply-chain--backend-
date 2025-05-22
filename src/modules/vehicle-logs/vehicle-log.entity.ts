import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Shipment } from '../shipments/shipment.entity';

@Entity('vehicle_logs')
export class VehicleLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  vehicle: Vehicle;

  @ManyToOne(() => Shipment, (shipment) => shipment.id)
  shipment: Shipment;

  @Column()
  location: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column('text')
  note: string;
}
