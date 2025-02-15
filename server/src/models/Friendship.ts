import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('Friendship')
export class Friendship {
  @PrimaryGeneratedColumn()
  friendshipId!: number;

  @ManyToOne(() => User, (user) => user.friendships)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => User, (user) => user.friendRequests)
  @JoinColumn({ name: 'friend_id' })
  friend!: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status!: 'pending' | 'accepted' | 'rejected';
}
