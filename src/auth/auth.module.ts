import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [AuthResolver, AuthService, EmailService],
  imports: [UsersModule],
  exports: [AuthService],
})
export class AuthModule {}
