import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (!user.role) {
      throw new UnauthorizedException('User role is missing in the token');
    }

    console.log('User in RolesGuard:', user);

    // Allow only users with the 'Manager' role
    return user.role === 'Manager';
  }
}
