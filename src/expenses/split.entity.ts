import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Check,
} from 'typeorm';
import { Expense } from 'src/expenses/expense.entity';
import { User } from 'src/users/user.entity';
import { SplitValueType } from 'src/types/expense';

@Entity({ name: 'splits' })
@Check(`"value" >= 0`)
export class Split {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Expense, (expense) => expense.splits)
  @JoinColumn({ name: 'expense_id' })
  expense: Expense;

  @ManyToOne(() => User, (user) => user.split_member)
  @JoinColumn({ name: 'member_id' })
  member: User;

  @Column({
    type: 'enum',
    enum: SplitValueType,
    default: SplitValueType.PERCENT,
  })
  value_type: SplitValueType;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
  })
  created_at: Date;
}
