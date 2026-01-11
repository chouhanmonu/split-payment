import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { DEFAULT_CURRENCY } from 'src/utility/conts';
import { UserOnGroup } from './user-on-group.entity';

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

  @Column({
    name: 'default_currency',
    type: 'char',
    length: 3,
    default: DEFAULT_CURRENCY,
  })
  defaultCurrency: string;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @OneToMany(() => UserOnGroup, (uog) => uog.group)
  members: UserOnGroup[];

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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;
}
