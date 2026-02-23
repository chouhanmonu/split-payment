import { Group } from 'src/groups/entities/group.entity';
import { InviteUser } from 'src/types/invite';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('group_invites')
export class GroupInvite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id', nullable: false, unique: true })
  groupId: number;

  @Column({ type: 'varchar', unique: true, length: 64, nullable: false })
  token: string;

  @Column({
    type: 'timestamptz',
    name: 'expires_at',
    default: () => "NOW() + INTERVAL '7 days'",
  })
  expiresAt: Date;

  @Column({
    type: 'jsonb',
    name: 'used_by_users',
    default: () => "'[]'",
  })
  usedByUsers: InviteUser[];

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToOne(() => Group, (group) => group.invite, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
