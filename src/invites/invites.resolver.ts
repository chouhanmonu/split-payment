import { Resolver } from '@nestjs/graphql';
import { InvitesService } from './invites.service';

@Resolver()
export class InvitesResolver {
  constructor(private readonly inviteService: InvitesService) {}
}
