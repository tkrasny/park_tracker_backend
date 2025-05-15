import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const domain = configService.get<string>('AUTH0_DOMAIN');
    const audience = configService.get<string>('AUTH0_AUDIENCE');

    if (!domain || !audience) {
      const errorMsg = `Missing Auth0 configuration: ${!domain ? 'AUTH0_DOMAIN' : ''} ${!audience ? 'AUTH0_AUDIENCE' : ''}`;
      throw new Error(errorMsg);
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`
      }),
    });

    this.logger.log('JWT Strategy configured with:', {
      domain,
      audience,
      issuer: `https://${domain}/`,
    });
  }

  async validate(payload: any) {
    try {
      this.logger.debug('Validating JWT payload:', {
        sub: payload.sub,
        aud: payload.aud,
        iss: payload.iss,
      });
      
      if (!payload.sub) {
        this.logger.error('Invalid token payload - missing sub claim');
        throw new UnauthorizedException('Invalid token payload');
      }

      return {
        userId: payload.sub,
        permissions: payload.permissions || [],
      };
    } catch (error) {
      this.logger.error('JWT validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}