import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @ManyToOne(() => User, (user) => user.warehouses, { nullable: false })
  manager: User;

  @Column('int')
  capacity: number;

  @CreateDateColumn()
  created_at: Date;
}
