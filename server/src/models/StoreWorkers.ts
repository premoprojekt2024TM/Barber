import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './Store';
import { User } from './User';

@Entity()
export class StoreWorkers {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Store, (store) => store.pictures, { onDelete: 'CASCADE' })
  @JoinColumn()
  store!: Store;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'worker1Id' })
  worker1?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'worker2Id' })
  worker2?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'worker3Id' })
  worker3?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'worker4Id' })
  worker4?: User;
}
