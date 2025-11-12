import { Field, Float, ObjectType } from '@nestjs/graphql';
import { UserModel } from 'src/users/models/user.model';

@ObjectType()
class ExpiresIn {
  @Field(() => Float)
  token: number;

  @Field(() => Float)
  refreshToken: number;
}

@ObjectType()
export class LoginResponse {
  @Field(() => UserModel)
  user: UserModel;

  @Field()
  token: string;

  @Field()
  refreshToken: string;

  @Field(() => ExpiresIn)
  expiresIn: ExpiresIn;
}
