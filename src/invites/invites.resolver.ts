import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InvitesService } from './invites.service';
import { UpdateTokenInput } from './inputs/update-token.input';
import { InviteBasic } from './models/invite.model';
import { User } from 'src/auth/auth.decorator';
import type { AppJwtPayload } from 'src/types/auth';

@Resolver()
export class InvitesResolver {
  constructor(private readonly inviteService: InvitesService) {}

  @Mutation(() => InviteBasic)
  updateInviteToken(
    @Args('updateTokenInput') updateTokenInput: UpdateTokenInput,
    @User() userPayload: AppJwtPayload,
  ) {
    return this.inviteService.updateToken(updateTokenInput, userPayload);
  }
}
