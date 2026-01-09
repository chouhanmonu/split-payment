import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: number;

  @Field()
  userUid: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  profilePictureUrl?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  defaultCurrency: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
