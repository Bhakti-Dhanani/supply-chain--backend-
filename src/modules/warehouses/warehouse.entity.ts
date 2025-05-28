import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { WarehouseLocation } from '../warehouse-locations/warehouse-location.entity';
import { WarehouseProduct } from '../warehouse-products/warehouse-product.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => WarehouseLocation, { nullable: true })
  @JoinColumn()
  location: WarehouseLocation;

  @ManyToOne(() => User, (user) => user.warehouses, { nullable: false })
  manager: User;

  @Column('int')
  capacity: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => WarehouseProduct, (warehouseProduct) => warehouseProduct.warehouse)
  products: WarehouseProduct[];
}
