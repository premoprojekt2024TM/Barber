import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './Store';

@Entity('StorePictures')
export class StorePictures {
  @PrimaryGeneratedColumn()
  pictureId!: number;

  @ManyToOne(() => Store, (store) => store.storePictures)
  @JoinColumn({ name: 'store_id' })
  store!: Store;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({
    type: 'enum',
    enum: ['cover_image', 'basic_image'],
    default: 'basic_image',
  })
  imageType!: 'cover_image' | 'basic_image';
}
