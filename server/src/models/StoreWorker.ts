import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Store } from "./Store";

@Entity("StoreWorker")
export class StoreWorker {
  @PrimaryGeneratedColumn()
  storeWorkerId!: number;

  @ManyToOne(() => Store, (store) => store.storeWorkers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "store_id" })
  store!: Store;

  @ManyToOne(() => User, (user) => user.storeWorkers)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({
    type: "enum",
    enum: ["owner", "worker"],
    default: "worker",
  })
  role!: "owner" | "worker";
}
