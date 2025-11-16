import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly skipOperations = [
    'signUp',
    'login',
    'resetPassword',
    'restoreMe',
  ];

  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext();
    const operationName = gqlCtx.getInfo()?.fieldName;

    if (this.skipOperations.includes(operationName as string)) {
      return true;
    }

    const token = req.headers?.authentication?.replace?.(
      'Bearer ',
      '',
    ) as string;
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = this.authService.verifyToken(token);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
