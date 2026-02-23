import { Field, ID, ObjectType, OmitType } from '@nestjs/graphql';
import { GroupBasic } from 'src/groups/models/group.model';

@ObjectType()
export class Invite {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  groupId: number;

  @Field()
  token: string;

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => GroupBasic)
  group: GroupBasic;
}

@ObjectType()
export class InviteBasic extends OmitType(Invite, ['group'] as const) {}
