import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('reorder_alerts')
export class ReorderAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  warehouse: Warehouse;

  @Column('int')
  threshold: number;

  @Column({ default: false })
  is_triggered: boolean;
}
