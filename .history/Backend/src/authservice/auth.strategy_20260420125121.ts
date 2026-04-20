import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // A mesma chave do seu .env
    });
  }

  async validate(payload: any) {
    // O que retornarmos aqui será injetado no 'req.user'
    return { userId: payload.sub, email: payload.email };
  }
}
