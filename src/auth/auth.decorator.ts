import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AppJwtPayload } from 'src/types/auth';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext): AppJwtPayload => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    return request.user;
  },
);
