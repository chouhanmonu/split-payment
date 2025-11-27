import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { SplitValueType } from 'src/types/expense';
import { UserModel } from 'src/users/models/user.model';

@ObjectType()
export class SplitModel {
  @Field(() => ID)
  id: number;

  @Field(() => SplitValueType)
  value_type: SplitValueType;

  @Field(() => Float)
  value: number;

  @Field(() => UserModel)
  member: UserModel;

  @Field(() => Date)
  created_at: Date;
}
