import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { AvailabilityTimes } from "./Availability";

@Entity("Appointment")
export class Appointment {
  @PrimaryGeneratedColumn()
  appointmentId!: number;

  @ManyToOne(() => User, (user) => user.appointments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "client_id" })
  client!: User;

  @ManyToOne(() => User, (user) => user.workerAppointments, {
    onDelete: "CASCADE",
  }) 
  @JoinColumn({ name: "worker_id" })
  worker!: User;

  @ManyToOne(
    () => AvailabilityTimes,
    (availabilityTimes) => availabilityTimes.appointments,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "time_slot_id" })
  timeSlot!: AvailabilityTimes;

  @Column({
    type: "enum",
    enum: ["confirmed", "completed"],
    default: "confirmed",
  })
  status!: "confirmed" | "completed";

  @Column({ nullable: true })
  notes?: string;

}
