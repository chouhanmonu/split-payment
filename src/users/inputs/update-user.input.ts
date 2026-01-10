import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(30)
  userUid: string;

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
  profilePictureUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(3, 3)
  defaultCurrency: string;
}
