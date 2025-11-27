import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class AddExpenseInput {
  @Field()
  @MaxLength(200)
  description: string;
}
