import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddGroupInput } from './inputs/add-group.input';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppJwtPayload } from 'src/types/auth';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addGroup(addGroupInput: AddGroupInput, userPayload: AppJwtPayload) {
    const createdBy = await this.userRepository.findOneBy({
      id: Number(userPayload.sub),
    });
    if (!createdBy) throw new NotFoundException('User not found');

    const groupEntity = this.groupRepository.create({
      ...addGroupInput,
      createdBy,
    });
    return this.groupRepository.save(groupEntity);
  }
}
