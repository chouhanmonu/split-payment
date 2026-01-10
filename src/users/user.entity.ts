import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { UserRefreshToken } from './user-refresh-token.entity';
import { Expense } from 'src/expenses/expense.entity';
import { DEFAULT_CURRENCY } from 'src/utility/conts';
import { Split } from 'src/expenses/split.entity';
import { UserOnGroup } from 'src/groups/user-on-group.entity';
import { Group } from 'src/groups/group.entity';

@Entity('users')
@Unique(['userUid'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  userUid: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  profilePictureUrl: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'char', length: 3, default: DEFAULT_CURRENCY })
  defaultCurrency: string;

  @OneToMany(() => UserRefreshToken, (token) => token.user)
  refreshTokens: UserRefreshToken[];

  @OneToMany(() => Expense, (expense) => expense.addedBy)
  addedExpenses: Expense[];

  @OneToMany(() => Expense, (expense) => expense.payer)
  paidExpenses: Expense[];

  @OneToMany(() => Split, (split) => split.member)
  splitMembers: Split[];

  @OneToMany(() => UserOnGroup, (userOnGroup) => userOnGroup.userId)
  groupMemberships: UserOnGroup[];

  @OneToMany(() => Group, (group) => group.createdBy)
  createdGroups: Group[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
