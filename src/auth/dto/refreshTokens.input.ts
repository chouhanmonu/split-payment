import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class RefreshTokensInput {
  @Field()
  @MaxLength(1000)
  refreshToken: string;
}
