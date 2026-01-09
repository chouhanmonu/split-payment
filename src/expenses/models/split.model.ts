import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { SplitValueType } from 'src/types/expense';
import { UserModel } from 'src/users/models/user.model';
import { ExpenseModel } from './expense.model';

@ObjectType()
export class SplitModel {
  @Field(() => ID)
  id: number;

  @Field(() => ExpenseModel)
  expense: ExpenseModel;

  @Field(() => SplitValueType)
  valueType: SplitValueType;

  @Field(() => Float)
  value: number;

  @Field(() => UserModel)
  member: UserModel;

  @Field(() => Date)
  createdAt: Date;
}
