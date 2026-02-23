import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRefreshToken } from './entities/user-refresh-token.entity';
import { Friend } from './entities/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRefreshToken, Friend])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
