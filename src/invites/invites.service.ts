import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { GroupInvite } from './entities/invite.entity';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTokenInput } from './inputs/update-token.input';
import { UserOnGroup } from 'src/groups/entities/user-on-group.entity';
import { AppJwtPayload } from 'src/types/auth';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(GroupInvite)
    private readonly groupInviteRepository: Repository<GroupInvite>,
    @InjectRepository(UserOnGroup)
    private readonly userOnGroupRepository: Repository<UserOnGroup>,
  ) {}

  createInvite(manager: EntityManager, groupId: number) {
    const inviteEntity = manager.create(GroupInvite, {
      groupId,
      token: nanoid(),
    });

    return manager.save(inviteEntity);
  }

  async updateToken(
    updateTokenInput: UpdateTokenInput,
    userPayload: AppJwtPayload,
  ) {
    const { groupId } = updateTokenInput;

    const userOnGroup = await this.userOnGroupRepository.findOneBy({
      groupId: groupId,
      userId: Number(userPayload.sub),
    });
    if (!userOnGroup)
      throw new BadRequestException(
        `User not the member of the group with id ${groupId}`,
      );

    const invite = await this.groupInviteRepository.findOneBy({ groupId });
    if (!invite)
      throw new NotFoundException(
        `Invite for the group(${groupId}) not found!`,
      );

    const inviteEntity = await this.groupInviteRepository.preload({
      id: invite.id,
      groupId,
      token: nanoid(),
    });
    if (!inviteEntity)
      throw new NotFoundException(
        `Invite for the group(${groupId}) not found!`,
      );
    return this.groupInviteRepository.save(inviteEntity);
  }
}
