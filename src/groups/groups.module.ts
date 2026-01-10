import { Module } from '@nestjs/common';
import { GroupsResolver } from './groups.resolver';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOnGroup } from './entities/user-on-group.entity';
import { Group } from './entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserOnGroup])],
  exports: [TypeOrmModule],
  providers: [GroupsResolver, GroupsService],
})
export class GroupsModule {}
