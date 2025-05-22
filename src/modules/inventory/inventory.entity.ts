import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  warehouse: Warehouse;

  @Column('int')
  quantity: number;

  @UpdateDateColumn()
  last_updated: Date;
}
