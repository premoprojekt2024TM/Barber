import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ChatRoom } from './ChatRoom';
import { User } from './User';

@Entity('Message')
export class Message {
  @PrimaryGeneratedColumn()
  messageId!: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom)
  @JoinColumn({ name: 'chatroom_id' })
  chatRoom!: ChatRoom;

  @ManyToOne(() => User, (user) => user.chatRooms)
  @JoinColumn({ name: 'sender_id' })
  sender!: User;

  @Column()
  content!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
