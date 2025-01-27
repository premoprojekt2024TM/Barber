import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { AvailabilityTimes } from './Availability';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  client!: User; 

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  hairdresser!: User;  

  @ManyToOne(() => AvailabilityTimes, { onDelete: 'CASCADE' })
  @JoinColumn()
  timeSlot!: AvailabilityTimes;  

  @Column({
    type: 'enum',
    enum: ['confirmed', 'completed'],
    default: 'confirmed',
  })
  status!: 'confirmed' | 'completed'; 

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes?: string; 
}
