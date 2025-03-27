import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  getManager,
  BeforeRemove,
} from "typeorm";
import { User } from "./User";
import { AvailabilityTimes } from "./Availability";

@Entity("Appointment")
export class Appointment {
  @PrimaryGeneratedColumn()
  appointmentId!: number;

  @ManyToOne(() => User, (user) => user.appointments, { onDelete: "CASCADE" }) // Added onDelete: "CASCADE"
  @JoinColumn({ name: "client_id" })
  client!: User;

  @ManyToOne(() => User, (user) => user.workerAppointments, {
    onDelete: "CASCADE",
  }) // Added onDelete: "CASCADE"
  @JoinColumn({ name: "worker_id" })
  worker!: User;

  @ManyToOne(
    () => AvailabilityTimes,
    (availabilityTimes) => availabilityTimes.appointments,
    { onDelete: "CASCADE" }, // IMPORTANT: Add CASCADE delete
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

  @BeforeRemove() // Use BeforeRemove
  async updateAvailabilityTimesStatus(): Promise<void> {
    if (this.timeSlot) {
      const entityManager = getManager();
      this.timeSlot.status = "available";
      await entityManager.save(AvailabilityTimes, this.timeSlot);
    }
  }
}
