import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('Request object in User decorator:', request);
    if (!request.user) {
      console.error('User is not present in the request object');
      throw new UnauthorizedException('User is not authenticated');
    }
    console.log('Accessing user from request:', request.user);
    return request.user;
  },
);
