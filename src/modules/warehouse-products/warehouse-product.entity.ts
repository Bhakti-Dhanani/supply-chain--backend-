import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Product } from '../products/product.entity';

@Entity('warehouse_products')
export class WarehouseProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  warehouse: Warehouse;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column('int', { default: 0 })
  quantity: number;
}
