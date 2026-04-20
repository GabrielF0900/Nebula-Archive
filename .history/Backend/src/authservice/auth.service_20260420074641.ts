//Criando logica para criação de tokens para que seja acessivel tanto pelo service do login e register.

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async generateToken(userId: string | number, email: string) {
    const payload = { sub: userId, email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
