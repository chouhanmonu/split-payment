import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsInt,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

@InputType()
export class FriendInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  addresseeId: number;

  @Field()
  @IsString()
  @MaxLength(100)
  nickname: string;
}

@InputType()
export class AddFriendsInput {
  @Field(() => [FriendInput])
  @Type(() => FriendInput)
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  friends: FriendInput[];
}
