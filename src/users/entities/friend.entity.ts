import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { FriendStatus } from 'src/types/Friend';

@Entity('friends')
@Unique(['requesterId', 'addresseeId'])
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  nickname: string;

  @Column({
    name: 'requester_id',
    nullable: false,
  })
  requesterId: number;

  @Column({
    name: 'addressee_id',
    nullable: false,
  })
  addresseeId: number;

  @Column({
    type: 'enum',
    enum: FriendStatus,
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;

  @Column({ name: 'is_favorite', default: false })
  isFavorite: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  createdAt: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sentFriendRequests, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User, (user) => user.recievedFriendRequests, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'addressee_id' })
  addressee: User;
}
