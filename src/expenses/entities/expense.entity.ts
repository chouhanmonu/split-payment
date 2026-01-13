import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Check,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Split } from './split.entity';
import { SplitType } from 'src/types/expense';
import { DEFAULT_CURRENCY } from 'src/utility/conts';
import { Group } from 'src/groups/entities/group.entity';

@Entity('expenses')
@Check(`"amount" > 0`)
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => User, (user) => user.addedExpenses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'added_by_id' })
  addedBy: User;

  @ManyToOne(() => User, (user) => user.paidExpenses)
  @JoinColumn({ name: 'payer_id' })
  payer: User;

  @ManyToOne(() => Group, (group) => group.expenses, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'group_id' })
  group?: Group | null;

  @Column({
    name: 'split_type',
    type: 'enum',
    enum: SplitType,
    default: SplitType.EQUAL,
  })
  splitType: SplitType;

  @Column({
    type: 'char',
    length: 3,
    default: DEFAULT_CURRENCY,
  })
  currency: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => Split, (split) => split.expense, { cascade: true })
  splits: Split[];

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
  deletedAt?: Date;
}
