import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('ChatRoom')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  chatroomId!: number;

  @ManyToOne(() => User, (user) => user.chatRooms)
  @JoinColumn({ name: 'user1_id' })
  user1!: User;

  @ManyToOne(() => User, (user) => user.chatRooms2)
  @JoinColumn({ name: 'user2_id' })
  user2!: User;

  @Column()
  name!: string;
}
