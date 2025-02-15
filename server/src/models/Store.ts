import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StoreWorker } from './StoreWorker';
import { StorePictures } from './StorePictures';

@Entity('Store')
export class Store {
  @PrimaryGeneratedColumn()
  storeId!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

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

  @Column({ type: 'float' })
  latitude!: number;

  @Column({ type: 'float' })
  longitude!: number;

  @OneToMany(() => StoreWorker, (storeWorker) => storeWorker.store)
  storeWorkers!: StoreWorker[];

  @OneToMany(() => StorePictures, (storePictures) => storePictures.store)
  storePictures!: StorePictures[];
}
