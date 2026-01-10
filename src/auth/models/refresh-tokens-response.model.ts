import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RefreshTokensResponse {
  @Field()
  token: string;

  @Field()
  refreshToken: string;
}
