import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { SplitType } from 'src/types/expense';
import { UserModel } from 'src/users/models/user.model';
import { SplitModel } from './split.model';
import { Group } from 'src/groups/models/group.model';

@ObjectType()
export class ExpenseModel {
  @Field(() => ID)
  id: number;

  @Field(() => Group, { nullable: true })
  group: Group;

  @Field()
  description: string;

  @Field(() => Float)
  amount: number;

  @Field(() => UserModel)
  addedBy: UserModel;

  @Field(() => UserModel)
  payer: UserModel;

  @Field(() => SplitType)
  splitType: SplitType;

  @Field()
  currency: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => [SplitModel])
  splits: SplitModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}
