import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

@InputType()
class MemberInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  userId: number;
}

@InputType()
export class AddMembersInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  groupId: number;

  @Field(() => [MemberInput])
  @ValidateNested({ each: true })
  @Type(() => MemberInput)
  @ArrayMinSize(1, { message: 'Min 1 member required' })
  @ArrayMaxSize(10, { message: 'Max 10 members at a time' })
  members: MemberInput[];
}
