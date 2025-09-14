import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    // Only use local auth in development
    if (this.configService.get('NODE_ENV') !== 'development') {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    // For local development, create a mock user
    request.user = {
      sub: 'local-dev-user',
      dbUser: {
        id: 1,
        email: 'dev@example.com',
        auth0Id: 'local-dev-user',
        name: 'Local Dev User',
      },
    };

    return true;
  }
}
