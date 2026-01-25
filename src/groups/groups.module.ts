import { Module } from '@nestjs/common';
import { GroupsResolver } from './groups.resolver';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOnGroup } from './entities/user-on-group.entity';
import { Group } from './entities/group.entity';
import { User } from 'src/users/entities/user.entity';
import { GroupInvite } from 'src/invites/entities/invite.entity';
import { InvitesModule } from 'src/invites/invites.module';
import { InvitesService } from 'src/invites/invites.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, UserOnGroup, User, GroupInvite]),
    InvitesModule,
  ],
  exports: [TypeOrmModule],
  providers: [GroupsResolver, GroupsService, InvitesService],
})
export class GroupsModule {}
