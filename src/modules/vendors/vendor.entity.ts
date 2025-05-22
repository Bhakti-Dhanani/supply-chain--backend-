import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum VendorStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  userId: User; // Renamed for clarity

  @Column()
  company_name?: string;

  @Column({ type: 'enum', enum: VendorStatus })
  status: VendorStatus;

  @CreateDateColumn()
  created_at: Date;
}
