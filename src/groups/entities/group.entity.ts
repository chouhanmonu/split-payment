import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserOnGroup } from './user-on-group.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { GroupInvite } from 'src/invites/entities/invite.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'image_url', length: 512, nullable: true })
  imageUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.createdGroups, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;

  @OneToMany(() => UserOnGroup, (uog) => uog.group)
  members: UserOnGroup[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];

  @OneToOne(() => GroupInvite, (invite) => invite.group)
  invite: GroupInvite;
}
