import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class UpdateTokenInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  groupId: number;
}
