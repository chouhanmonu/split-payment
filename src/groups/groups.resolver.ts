import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Group } from './models/group.model';
import { User } from 'src/auth/auth.decorator';
import type { AppJwtPayload } from 'src/types/auth';
import { AddGroupInput } from './inputs/add-group.input';
import { GroupsService } from './groups.service';

@Resolver()
export class GroupsResolver {
  constructor(private readonly groupService: GroupsService) {}

  @Mutation(() => Group)
  addGroup(
    @Args('addGroupInput') addGroupInput: AddGroupInput,
    @User() user: AppJwtPayload,
  ) {
    return this.groupService.addGroup(addGroupInput, user);
  }
}
