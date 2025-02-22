import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('ExtendedWorker')
export class ExtendedWorker {
  static mockImplementation(arg0: () => { save: jest.Mock<any, any, any>; }) {
      throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ nullable: true })
  description?: string;

  @OneToOne(() => User, (user) => user.extendedWorker)
  @JoinColumn()
  user!: User;
}
