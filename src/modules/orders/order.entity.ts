import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';

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

  @ManyToOne(() => Vendor, (vendor) => vendor.id)
  vendor: Vendor;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column('decimal')
  total_amount: number;

  @CreateDateColumn()
  created_at: Date;
}
