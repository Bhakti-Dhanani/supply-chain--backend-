import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

@Entity('transporters')
export class Transporter {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  vehicle_count: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.transporter)
  vehicles: Vehicle[];
}
