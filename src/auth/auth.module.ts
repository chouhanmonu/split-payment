import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [UsersModule],
  exports: [AuthService],
})
export class AuthModule {}
