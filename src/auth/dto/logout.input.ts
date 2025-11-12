import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MaxLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @MaxLength(254)
  @IsEmail()
  email: string;
}
