import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';  

@Entity()
export class ExtendedUser {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })  
  @JoinColumn()  
  user!: User;   
  
  @Column({ nullable: true }) 
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ nullable: true }) 
  profilePic?: string;
}
