import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    console.log('User in RolesGuard:', user);

    // Check if the user has the required role
    if (!user || !user.role) {
      console.error('User or role is missing in the request');
      return false;
    }

    // Allow only users with the 'Manager' role
    return user.role === 'Manager';
  }
}
