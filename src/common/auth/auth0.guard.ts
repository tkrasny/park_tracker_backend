import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { expressjwt } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'util';
import { Auth0User } from './user.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class Auth0Guard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const checkJwt = promisify(
      expressjwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
        }),
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
      }),
    );

    try {
      const token = await checkJwt(request, response);
      const auth0User = token as Auth0User;
      
      // Create or update user in our database
      const user = await this.usersService.createOrUpdateFromAuth0(auth0User);
      
      // Attach both Auth0 user info and our database user to the request
      request.user = {
        ...auth0User,
        dbUser: user
      };
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 