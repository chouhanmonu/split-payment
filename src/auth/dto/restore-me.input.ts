import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class RestoreMeInput {
  @Field()
  @Length(64, 64)
  token: string;

  @Field()
  @Length(8, 128)
  password: string;
}
