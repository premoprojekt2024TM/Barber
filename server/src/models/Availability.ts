import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Appointment } from "./Appointment";

@Entity("AvailabilityTimes")
export class AvailabilityTimes {
  @PrimaryGeneratedColumn()
  timeSlotId!: number;

  @ManyToOne(() => User, (user) => user.availabilityTimes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  day!: string;

  @Column()
  timeSlot!: string;

  @Column({
    type: "enum",
    enum: ["accepted", "available"],
    default: "available",
  })
  status!: "accepted" | "available";

  @OneToMany(() => Appointment, (appointment) => appointment.timeSlot)
  appointments!: Appointment[];
}
