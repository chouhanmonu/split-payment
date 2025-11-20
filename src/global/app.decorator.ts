import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RequestMetadata } from 'src/types/request';
import { UAParser } from 'ua-parser-js';

export const RequestMeta = createParamDecorator(
  (data: unknown, context: ExecutionContext): RequestMetadata => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const parser = new UAParser();

    const userAgent = request.headers['user-agent'] as string;
    parser.setUA(userAgent);
    const userAgentObj = parser.getResult();
    const deviceId = request.headers['x-device-id'];
    const ip = request.ip as string;

    return {
      deviceId,
      userAgent: JSON.stringify(userAgentObj),
      ip,
    };
  },
);
