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
import { UserRefreshToken } from './userRefreshToken.entity';
import { Expense } from 'src/expenses/expense.entity';
import { DEFAULT_CURRENCY } from 'src/utility/conts';
import { Split } from 'src/expenses/split.entity';

@Entity('users')
@Unique(['user_uid'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  user_uid: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  profile_picture_url: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'char', length: 3, default: DEFAULT_CURRENCY })
  default_currency: string;

  @OneToMany(() => UserRefreshToken, (token) => token.user)
  refresh_tokens: UserRefreshToken[];

  @OneToMany(() => Expense, (expense) => expense.addedBy)
  added_expenses: Expense[];

  @OneToMany(() => Expense, (expense) => expense.payer)
  paid_expenses: Expense[];

  @OneToMany(() => Split, (split) => split.member)
  split_member: Split[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
