import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Transporter } from '../transporters/transporter.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transporter, (transporter) => transporter.id)
  transporter: Transporter;

  @Column()
  plate_number: string;

  @Column()
  type: string;

  @Column('int')
  capacity: number;
}
