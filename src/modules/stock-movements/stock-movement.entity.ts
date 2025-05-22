import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  warehouse: Warehouse;

  @Column('int')
  quantity: number;

  @Column({ type: 'enum', enum: MovementType })
  movement_type: MovementType;

  @CreateDateColumn()
  created_at: Date;
}
