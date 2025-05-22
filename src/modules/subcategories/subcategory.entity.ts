import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.subcategories, { onDelete: 'CASCADE' })
  category: Category;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
