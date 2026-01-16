import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Group } from './group.model';
import { UserModel } from 'src/users/models/user.model';
import { GroupRole } from 'src/types/group';

@ObjectType()
export class UserOnGroup {
  @Field(() => ID)
  userId: number;

  @Field(() => ID)
  groupId: number;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => Group)
  group: Group;

  @Field(() => GroupRole)
  role: GroupRole;

  @Field()
  joinedAt: Date;
}
