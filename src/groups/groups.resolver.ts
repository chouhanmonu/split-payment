import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Group } from './models/group.model';
import { User } from 'src/auth/auth.decorator';
import type { AppJwtPayload } from 'src/types/auth';
import { AddGroupInput } from './inputs/add-group.input';
import { GroupsService } from './groups.service';
import { UpdateGroupInput } from './inputs/update-group.input';
import { AddMembersInput } from './inputs/add-members.input';
import { GroupBasic } from './models/group-basic.model';

@Resolver()
export class GroupsResolver {
  constructor(private readonly groupService: GroupsService) {}

  @Mutation(() => Group)
  addGroup(
    @Args('addGroupInput') addGroupInput: AddGroupInput,
    @User() userPayload: AppJwtPayload,
  ) {
    return this.groupService.addGroup(addGroupInput, userPayload);
  }

  @Mutation(() => Group)
  addMembers(
    @Args('addMembersInput') addMembersInput: AddMembersInput,
    @User() userPayload: AppJwtPayload,
  ) {
    return this.groupService.addMembers(addMembersInput, userPayload);
  }

  @Mutation(() => GroupBasic)
  updateGroup(
    @Args('updateGroupInput') updateGroupInput: UpdateGroupInput,
    @User() userPayload: AppJwtPayload,
  ) {
    return this.groupService.updateGroup(updateGroupInput, userPayload);
  }
}

// TODO: add members -> new, select from friends list -> notify the members added
// new -> email, name -> add more -> notify
// ways to join: id, email, qr, link, generate new link
// TODO: update group, leave group, delete group
// admin: delete group, remove members
// instead of archieved groups hide settled-up groups
// todo: remove "default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'UTC'"" globally timestamptz is enough no default neede too
