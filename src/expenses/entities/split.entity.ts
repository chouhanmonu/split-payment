import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Check,
  JoinColumn,
} from 'typeorm';
import { Expense } from './expense.entity';
import { User } from 'src/users/entities/user.entity';
import { SplitValueType } from 'src/types/expense';

@Entity({ name: 'splits' })
@Check(`"value" >= 0`)
export class Split {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Expense, (expense) => expense.splits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expense_id' })
  expense: Expense;

  @ManyToOne(() => User, (user) => user.splitMembers)
  @JoinColumn({ name: 'member_id' })
  member: User;

  @Column({
    name: 'value_type',
    type: 'enum',
    enum: SplitValueType,
    default: SplitValueType.PERCENT,
  })
  valueType: SplitValueType;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
  })
  createdAt: Date;
}
