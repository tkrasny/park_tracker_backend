import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CombinedAuthGuard extends AuthGuard('jwt') {
  private localGuard: LocalAuthGuard;

  constructor(private configService: ConfigService) {
    super();
    this.localGuard = new LocalAuthGuard(configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Try local auth first in development
    if (this.configService.get('NODE_ENV') === 'development') {
      const localResult = await this.localGuard.canActivate(context);
      if (localResult) {
        return true;
      }
    }

    // Fall back to JWT auth
    return super.canActivate(context) as Promise<boolean>;
  }
} 