import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { AvailabilityTimes } from "./Availability";
import { Appointment } from "./Appointment";
import { Friendship } from "./Friendship";
import { StoreWorker } from "./StoreWorker";
import { ChatRoom } from "./ChatRoom";

@Entity("User")
export class User {
  @PrimaryGeneratedColumn("increment")
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
    type: "enum",
    enum: ["client", "worker"],
    default: "client",
  })
  role!: "client" | "worker";

  @OneToMany(
    () => AvailabilityTimes,
    (availabilityTimes) => availabilityTimes.user,
    {
      cascade: true,
      onDelete: "CASCADE",
    },
  )
  availabilityTimes!: AvailabilityTimes[];

  @OneToMany(() => Appointment, (appointment) => appointment.client, {
    cascade: true,
    onDelete: "CASCADE",
  })
  appointments!: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.worker, {
    cascade: true,
    onDelete: "CASCADE",
  })
  workerAppointments!: Appointment[];

  @OneToMany(() => Friendship, (friendship) => friendship.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  friendships!: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.friend, {
    cascade: true,
    onDelete: "CASCADE",
  })
  friendRequests!: Friendship[];

  @OneToMany(() => StoreWorker, (storeWorker) => storeWorker.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  storeWorkers!: StoreWorker[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user1, {
    cascade: true,
    onDelete: "CASCADE",
  })
  chatRooms!: ChatRoom[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user2, {
    cascade: true,
    onDelete: "CASCADE",
  })
  chatRooms2!: ChatRoom[];

  extendedWorker: any;
}
