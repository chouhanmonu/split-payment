import { Module } from '@nestjs/common';
import { GroupsResolver } from './groups.resolver';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { UserOnGroup } from './user-on-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserOnGroup])],
  exports: [TypeOrmModule],
  providers: [GroupsResolver, GroupsService],
})
export class GroupsModule {}
