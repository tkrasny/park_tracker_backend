import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../entities/user.entity';

export interface Auth0User {
  sub: string; // Auth0 user ID
  email?: string; // User's email
  name?: string; // User's name
  picture?: string; // User's profile picture
  email_verified?: boolean;
}

export interface RequestUser extends Auth0User {
  dbUser: User; // Our database user
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
