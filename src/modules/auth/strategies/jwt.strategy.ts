import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '323efbde0be0f9af002ab6ff5654557fd5e98fbef3469e41fe2ab99ce8d5294c',
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT Payload: ${JSON.stringify(payload)}`);
    const user = { id: payload.sub, role: payload.role };
    this.logger.debug(`User extracted from JWT: ${JSON.stringify(user)}`);
    return user;
  }
}
