import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Transporter } from '../transporters/transporter.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transporter, (transporter) => transporter.vehicles)
  transporter: Transporter; // Update relationship to reference `vehicles` in Transporter

  @Column()
  plate_number: string;

  @Column()
  type: string;

  @Column('int')
  capacity: number;
}
