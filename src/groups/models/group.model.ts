import { Field, ID, ObjectType, OmitType } from '@nestjs/graphql';
import { UserModel } from 'src/users/models/user.model';
import { UserOnGroup } from './user-on-group.model';

@ObjectType()
export class Group {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => UserModel)
  createdBy: UserModel;

  @Field(() => [UserOnGroup])
  members: UserOnGroup[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}

@ObjectType()
export class GroupBasic extends OmitType(Group, [
  'members',
  'createdBy',
] as const) {}
