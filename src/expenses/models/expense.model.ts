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
  split_type: SplitType;

  @Field()
  currency: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => [SplitModel])
  splits: SplitModel[];

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field({ nullable: true })
  deleted_at?: Date;
}
