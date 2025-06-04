import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';
import { User } from '../users/user.entity';
import { Location } from '../location/location.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

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

  @ManyToOne(() => Warehouse, { nullable: true })
  warehouse: Warehouse;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column('decimal')
  total_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
  orderItems: OrderItem[];
}
