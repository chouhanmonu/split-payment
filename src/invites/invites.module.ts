import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesResolver } from './invites.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupInvite } from './entities/invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupInvite])],
  providers: [InvitesService, InvitesResolver],
})
export class InvitesModule {}
