import { Field, ID, ObjectType } from '@nestjs/graphql';
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

  @Field()
  createdById: number;

  @Field(() => UserModel)
  createdBy: UserModel;

  @Field()
  defaultCurrency: string;

  @Field()
  isArchived: boolean;

  @Field(() => [UserOnGroup])
  members: UserOnGroup[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}
