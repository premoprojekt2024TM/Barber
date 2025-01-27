import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn ,OneToMany} from 'typeorm';
import { User } from './User';
import { StorePictures } from './StorePictures';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy!: User;

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
  
  @Column('double precision', { nullable: true })
  latitude?: number;

  @Column('double precision', { nullable: true })
  longitude?: number;
  
  @OneToMany(() => StorePictures, (storePicture) => storePicture.store)
  pictures!: StorePictures[];
  
}
