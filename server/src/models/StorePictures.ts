import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './Store';  

@Entity()
export class StorePictures {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Store, (store) => store.pictures, { onDelete: 'CASCADE' })  
  @JoinColumn()
  store!: Store;  
  @Column({ nullable: true })
  coverimage?: string;  

  @Column({ nullable: true })
  coverimage2?: string;

  @Column({ nullable: true })
  coverimage3?: string; 

  @Column({ nullable: true })
  coverimage4?: string; 

}
