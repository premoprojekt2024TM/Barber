import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('ExtendedWorker')
export class ExtendedWorker {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ nullable: true })
  description?: string;

  @OneToOne(() => User, (user) => user.extendedWorker)
  @JoinColumn()
  user!: User;
}
