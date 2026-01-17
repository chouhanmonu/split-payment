import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddGroupInput } from './inputs/add-group.input';
import { DataSource, In, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppJwtPayload } from 'src/types/auth';
import { User } from 'src/users/entities/user.entity';
import { UpdateGroupInput } from './inputs/update-group.input';
import { UserOnGroup } from './entities/user-on-group.entity';
import { AddMembersInput } from './inputs/add-members.input';
import { GroupRole } from 'src/types/group';

@Injectable()
export class GroupsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserOnGroup)
    private readonly userOnGroupRepository: Repository<UserOnGroup>,
  ) {}

  async addGroup(addGroupInput: AddGroupInput, userPayload: AppJwtPayload) {
    const user = await this.userRepository.findOneBy({
      id: Number(userPayload.sub),
    });
    if (!user) throw new NotFoundException('User not found');

    return this.dataSource.transaction(async (manager) => {
      const groupEntity = manager.create(Group, {
        ...addGroupInput,
        createdBy: user,
      });
      const addedGroup = await manager.save(groupEntity);

      const userOnGroupEntity = manager.create(UserOnGroup, {
        group: addedGroup,
        user: user,
        role: GroupRole.ADMIN,
      });

      const addedMembers = await manager.save(userOnGroupEntity);
      return {
        ...addedGroup,
        members: [addedMembers],
      };
    });
  }

  async addMembers(
    addMembersInput: AddMembersInput,
    userPayload: AppJwtPayload,
  ) {
    const user = await this.userRepository.findOneBy({
      id: Number(userPayload.sub),
    });
    if (!user) throw new NotFoundException('User not found');

    const { groupId, members: memberIds } = addMembersInput;

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['members', 'members.user', 'members.group', 'createdBy'],
    });
    if (!group) throw new NotFoundException('Group not found');

    const memberIdsArr = memberIds.map((member) => member.userId);
    const members = await this.userRepository.findBy({
      id: In(memberIdsArr),
    });
    if (members.length !== memberIdsArr.length)
      throw new NotFoundException(`One or more members not found`);

    const usersOnGroup = await this.userOnGroupRepository.findBy({
      groupId: group.id,
    });
    const isUserMember = usersOnGroup.some((uog) => uog.userId === user.id);
    if (!isUserMember)
      throw new BadRequestException('User not a member of the group');

    const preppedMembers = members.filter(
      (member) => !usersOnGroup.map((u) => u.userId).includes(member.id),
    );
    const usersOnGroupEntities = preppedMembers.map((user) =>
      this.userOnGroupRepository.create({
        user: user,
        group: group,
        role: GroupRole.MEMBER,
      }),
    );
    const addedMembers =
      await this.userOnGroupRepository.save(usersOnGroupEntities);

    return {
      ...group,
      members: [...group.members, ...addedMembers],
    };
  }

  async updateGroup(
    updateGroupInput: UpdateGroupInput,
    userPayload: AppJwtPayload,
  ) {
    const groupEntity = await this.groupRepository.preload({
      ...updateGroupInput,
    });
    if (!groupEntity) throw new NotFoundException('Group not found');

    const userOnGroup = await this.userOnGroupRepository.findOneBy({
      groupId: groupEntity.id,
      userId: Number(userPayload.sub),
    });
    if (!userOnGroup)
      throw new NotFoundException('User not a member of the group');

    return this.groupRepository.save(groupEntity);
  }
}
