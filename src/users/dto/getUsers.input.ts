import { InputType, Field } from '@nestjs/graphql';
import { StringFilter } from 'src/utility/input-types';

@InputType()
export class UserWhereInput {
  @Field(() => StringFilter, { nullable: true })
  userid?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  email?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  phone?: StringFilter;
}

@InputType()
class UserOrderInput {
  @Field({ nullable: true })
  name?: 'ASC' | 'DESC';

  @Field({ nullable: true })
  created_at?: 'ASC' | 'DESC';
}

@InputType()
export class FindUsersInput {
  @Field(() => UserWhereInput, { nullable: true })
  where?: UserWhereInput;

  @Field(() => UserOrderInput, { nullable: true })
  order?: UserOrderInput;

  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;
}
