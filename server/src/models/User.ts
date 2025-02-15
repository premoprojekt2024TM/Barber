import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { AvailabilityTimes } from './Availability';
import { Appointment } from './Appointment';
import { Friendship } from './Friendship';
import { StoreWorker } from './StoreWorker';
import { ChatRoom } from './ChatRoom';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('increment')
  userId!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  profilePic?: string;

  @Column({
    type: 'enum',
    enum: ['client', 'worker'],
    default: 'client',
  })
  role!: 'client' | 'worker';

  @OneToMany(() => AvailabilityTimes, (availabilityTimes) => availabilityTimes.user)
  availabilityTimes!: AvailabilityTimes[];

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments!: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.worker)
  workerAppointments!: Appointment[];

  @OneToMany(() => Friendship, (friendship) => friendship.user)
  friendships!: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.friend)
  friendRequests!: Friendship[];

  @OneToMany(() => StoreWorker, (storeWorker) => storeWorker.user)
  storeWorkers!: StoreWorker[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user1)
  chatRooms!: ChatRoom[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user2)
  chatRooms2!: ChatRoom[];
    extendedWorker: any;
}
