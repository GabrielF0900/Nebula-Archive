//Criando logica para criação de tokens para que seja acessivel tanto pelo service do login e register.

import { Injectable, ValidationPipe } from '@nestjs/common';
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

  async validateLoginUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    //Compara a senha
    if (!user || !(await this.comparePassword(pass, user.password))) {
      throw new Un
  }

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
