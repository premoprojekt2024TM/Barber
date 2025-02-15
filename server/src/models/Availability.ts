import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('AvailabilityTimes')
export class AvailabilityTimes {
  @PrimaryGeneratedColumn()
  timeSlotId!: number;

  @ManyToOne(() => User, (user) => user.availabilityTimes)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  day!: string;

  @Column()
  timeSlot!: string;

  @Column({
    type: 'enum',
    enum: ['accepted', 'available'],
    default: 'available',
  })
  status!: 'accepted' | 'available';
}
