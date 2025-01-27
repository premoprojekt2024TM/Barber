import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from 'typeorm';
import { AvailabilityTimes } from './Availability';
@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: ['client', 'hairdresser'],
    default: 'client', 
  })
  role!: 'client' | 'hairdresser';
  
  @OneToMany(() => AvailabilityTimes, (availabilityTimes) => availabilityTimes.user)
   availabilityTimes!: AvailabilityTimes[];
}
