import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { GroupInvite } from './entities/invite.entity';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(GroupInvite)
    private readonly groupInviteRepository: Repository<GroupInvite>,
  ) {}

  inviteUsers(manager: EntityManager, groupId: number) {
    const inviteEntity = manager.create(GroupInvite, {
      groupId,
      token: nanoid(32),
    });

    return manager.save(inviteEntity);
  }
}
