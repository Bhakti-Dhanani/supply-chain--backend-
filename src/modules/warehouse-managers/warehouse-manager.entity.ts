import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('warehouse_managers')
export class WarehouseManager {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id, { eager: true })
  assigned_warehouse?: Warehouse;

  @CreateDateColumn()
  created_at: Date;
}
