import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(30)
  user_uid: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(254)
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(512)
  profile_picture_url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(3, 3)
  default_currency: string;
}
