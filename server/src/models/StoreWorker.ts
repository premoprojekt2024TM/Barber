import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Store } from './Store';

@Entity('StoreWorker')
export class StoreWorker {
  @PrimaryGeneratedColumn()
  storeWorkerId!: number;

  // Many-to-one relationship to Store
  @ManyToOne(() => Store, (store) => store.storeWorkers)
  @JoinColumn({ name: 'store_id' })
  store!: Store;

  // Many-to-one relationship to User
  @ManyToOne(() => User, (user) => user.storeWorkers)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // Column for defining role
  @Column({
    type: 'enum',
    enum: ['owner', 'worker'],
    default: 'worker',
  })
  role!: 'owner' | 'worker';
}
