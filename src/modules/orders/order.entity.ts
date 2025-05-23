import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';
import { User } from '../users/user.entity';
import { Location } from '../location/location.entity';

export enum OrderStatus {
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  vendor: User;

  @ManyToOne(() => Location, { nullable: true })
  location: Location;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column('decimal')
  total_amount: number;

  @CreateDateColumn()
  created_at: Date;
}
