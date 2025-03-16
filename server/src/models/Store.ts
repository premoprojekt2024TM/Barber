import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { StoreWorker } from "./StoreWorker";

@Entity("Store")
export class Store {
  @PrimaryGeneratedColumn()
  storeId!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  postalCode!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column({ type: "float" })
  latitude!: number;

  @Column({ type: "float" })
  longitude!: number;

  @Column()
  picture?: string;

  @OneToMany(() => StoreWorker, (storeWorker) => storeWorker.store)
  storeWorkers!: StoreWorker[];
}
