import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RequestMetaInput {
  @Field()
  @IsNotEmpty()
  deviceId: string;

  @Field()
  @IsNotEmpty()
  ip: string;

  @Field()
  @IsNotEmpty()
  userAgent: string;
}
