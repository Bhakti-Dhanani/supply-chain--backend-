import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';
import { WarehouseManager } from '../warehouse-managers/warehouse-manager.entity'; // Import WarehouseManager
import { Warehouse } from '../warehouses/warehouse.entity';

export enum UserRole {
  ADMIN = 'Admin',
  VENDOR = 'Vendor',
  WAREHOUSE_MANAGER = 'Manager',
  TRANSPORTER = 'Transporter',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Vendor, (vendor) => vendor.userId)
  vendor: Vendor;

  @OneToOne(() => WarehouseManager, (warehouseManager) => warehouseManager.user)
  warehouseManager: WarehouseManager;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.manager)
  warehouses: Warehouse[];
}
