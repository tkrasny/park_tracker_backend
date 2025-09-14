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
    // Always use JWT auth
    return super.canActivate(context) as Promise<boolean>;
  }
}
