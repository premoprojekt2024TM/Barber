import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './User';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;  

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user1_id' })
  user1!: User;  

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user2_id' })
  user2!: User;  

  @Column()
  name!: string; 
}
