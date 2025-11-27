import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/createUser.input';
import { UserModel } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './models/loginResponse.model';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RefreshTokensResponse } from './models/refreshTokensResponse.model';
import { User } from './auth.decorator';
import type { AppJwtPayload } from 'src/types/auth';
import { Response } from 'src/utility/global.model';
import { ResetPassordInput } from './dto/resetPassword.input';
import { RestoreMeInput } from './dto/restoreMe.input';
import { RequestMeta } from 'src/global/requestMeta/requestMeta.decorator';
import { RequestMetaInput } from 'src/global/dto/requestMeta.input';
import { RequestMetaValidationPipe } from 'src/global/requestMetaValidation/requestMetaValidation.pipe';

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
  login(
    @Args('loginInput') loginInput: LoginInput,
    @RequestMeta(new RequestMetaValidationPipe())
    RequestMetadata: RequestMetaInput,
  ) {
    return this.authService.login(loginInput, RequestMetadata);
  }

  @Mutation(() => RefreshTokensResponse)
  refreshTokens(
    @User() user: AppJwtPayload,
    @RequestMeta(new RequestMetaValidationPipe())
    requestMetadata: RequestMetaInput,
  ) {
    return this.authService.refreshTokens(user, requestMetadata);
  }

  @Mutation(() => Response)
  async logout(
    @User() user: AppJwtPayload,
    @RequestMeta(new RequestMetaValidationPipe())
    requestMetadata: RequestMetaInput,
  ) {
    await this.authService.logout(user, requestMetadata);
    return {
      success: true,
      message: 'Logout success!',
    };
  }

  @Mutation(() => Response)
  async deleteMe(@User() user: AppJwtPayload) {
    await this.authService.deleteMe(user);
    return {
      success: true,
      message: 'User deleted successfully!',
    };
  }

  @Mutation(() => Response)
  async restoreMe(@Args('restoreMeInput') restoreMeInput: RestoreMeInput) {
    await this.authService.restoreMe(restoreMeInput);

    return {
      success: true,
      message: 'User restored successfully!',
    };
  }

  @Mutation(() => Response)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPassordInput,
  ) {
    // TODO: max 3 attemps per day from an ip
    await this.authService.resetPassword(resetPasswordInput);

    return {
      success: true,
      message: 'Email sent successfully!',
    };
  }

  // oauth
}
