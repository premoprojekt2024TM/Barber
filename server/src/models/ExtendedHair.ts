import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';  

@Entity()
export class ExtendedHair {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })  
  @JoinColumn()  
  user!: User;   
  
  @Column({ nullable: true }) 
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true }) 
  profilePic?: string;
  
  @Column({ nullable: true }) 
  isVerified?: boolean;
  
  @Column({ nullable: true }) 
  description?: string;
  
  
}
