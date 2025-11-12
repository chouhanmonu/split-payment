import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/createUser.input';
import { UserModel } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './models/loginResponse.model';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RefreshTokensInput } from './dto/refreshTokens.input';
import { RefreshTokensResponse } from './models/refreshTokensResponse.model';
import { User } from './auth.decorator';
import { LogoutResponse } from './models/logoutResponse.model';
import type { AppJwtPayload } from 'src/types/auth';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => UserModel)
  signUp(@Args('newUserInput') newUserInput: CreateUserInput) {
    return this.usersService.create(newUserInput);
  }

  @Mutation(() => LoginResponse)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => RefreshTokensResponse)
  refreshTokens(
    @Args('refreshTokensInput') refreshTokensInput: RefreshTokensInput,
  ) {
    return this.authService.refreshTokens(refreshTokensInput);
  }

  @Mutation(() => LogoutResponse)
  async logout(@User() user: AppJwtPayload) {
    await this.authService.logout(user);
    return {
      message: 'Logout success!',
    };
  }

  // delele acoount

  // restore account

  // reset password

  // oauth
}
