import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { SplitType } from 'src/types/expense';
import { UserModel } from 'src/users/models/user.model';
import { SplitModel } from './split.model';

@ObjectType()
export class ExpenseModel {
  @Field(() => ID)
  id: number;

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
