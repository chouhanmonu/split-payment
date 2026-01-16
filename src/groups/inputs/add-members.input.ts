import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsInt, Min, ValidateNested } from 'class-validator';

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
  @ArrayMaxSize(10, { message: 'Max 10 members at a time' })
  members: MemberInput[];
}
