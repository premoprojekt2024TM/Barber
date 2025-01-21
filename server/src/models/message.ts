import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { ChatRoom } from './ChatRoom';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;  

  @ManyToOne(() => ChatRoom, { eager: true })
  @JoinColumn({ name: 'chatroom_id' })
  chatRoom!: ChatRoom;  

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender!: User; 

  @Column('text')
  content!: string;  

  @CreateDateColumn()
  createdAt!: Date;  
}
