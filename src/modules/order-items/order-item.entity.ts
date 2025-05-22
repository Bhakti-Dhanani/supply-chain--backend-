import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number;
}
