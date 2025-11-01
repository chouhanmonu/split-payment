import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => Int)
  id: number;

  @Field()
  userid: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  profile_picture_url?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  default_currency: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}
