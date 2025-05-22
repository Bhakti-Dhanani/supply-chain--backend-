import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_name: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.id)
  uploaded_by: User;

  @Column()
  file_type: string;

  @CreateDateColumn()
  created_at: Date;
}
