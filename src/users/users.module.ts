import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRefreshTokens } from './userRefreshTokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRefreshTokens])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
