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
} from 'typeorm';
import { User } from 'src/users/user.entity';
// import { Group } from 'src/groups/group.entity';
import { Split } from './split.entity';
import { SplitType } from 'src/types/expense';
import { DEFAULT_CURRENCY } from 'src/utility/conts';

@Entity('expenses')
@Check(`"amount" > 0`)
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => User, (user) => user.added_expenses, {
    onDelete: 'CASCADE',
  })
  addedBy: User;

  @ManyToOne(() => User, (user) => user.paid_expenses)
  payer: User;

  // @ManyToOne(() => Group, { nullable: true })
  // @JoinColumn({ name: 'group_id' })
  // group?: Group;

  @Column({
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
  deletedAt?: Date;
}
