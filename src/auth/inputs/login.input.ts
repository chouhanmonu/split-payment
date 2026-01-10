import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length, MaxLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @MaxLength(254)
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 128)
  password: string;
}
