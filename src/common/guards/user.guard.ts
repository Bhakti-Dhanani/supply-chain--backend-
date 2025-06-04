import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      console.error('UserGuard: User object is missing in the request.');
      throw new UnauthorizedException('User is not authenticated');
    }

    console.log('UserGuard: User object validated successfully. User:', user);
    return true;
  }
}
