import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User'; 

@Entity()
export class AvailabilityTimes {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => User, (user) => user.availabilityTimes, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'varchar', length: 10 })  
  day!: string;

  @Column({ type: 'varchar', length: 5 }) 
  time_slot!: string;
  
  @Column({
    type: 'enum',
    enum: ['accepted', 'available'],
    default: 'available',
  })
  status!:  'accepted' | 'available';
  
}