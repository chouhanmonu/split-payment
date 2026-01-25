import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesResolver } from './invites.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupInvite } from './entities/invite.entity';
import { UserOnGroup } from 'src/groups/entities/user-on-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupInvite, UserOnGroup])],
  providers: [InvitesService, InvitesResolver],
})
export class InvitesModule {}
