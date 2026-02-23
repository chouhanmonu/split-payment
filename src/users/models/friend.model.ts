import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FriendStatus } from 'src/types/Friend';
import { UserModel } from './user.model';

@ObjectType()
export class Friend {
  @Field(() => ID)
  id: number;

  @Field()
  nickname: string;

  @Field(() => ID)
  requesterId: number;

  @Field(() => ID)
  addresseeId: number;

  @Field(() => FriendStatus)
  status: FriendStatus;

  @Field(() => Boolean)
  isFavorite: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class FriendWithRelations extends Friend {
  @Field(() => UserModel)
  requester: UserModel;

  @Field(() => UserModel)
  addressee: UserModel;
}
