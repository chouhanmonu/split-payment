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
import { Expense } from 'src/expenses/entities/expense.entity';
import { DEFAULT_CURRENCY } from 'src/utility/conts';
import { Split } from 'src/expenses/entities/split.entity';
import { UserOnGroup } from 'src/groups/entities/user-on-group.entity';
import { Group } from 'src/groups/entities/group.entity';

@Entity('users')
@Unique(['userUid'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_uid', type: 'varchar', length: 30, unique: true })
  userUid: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({
    name: 'profile_picture_url',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  profilePictureUrl: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({
    name: 'default_currency',
    type: 'char',
    length: 3,
    default: DEFAULT_CURRENCY,
  })
  defaultCurrency: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

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
}
