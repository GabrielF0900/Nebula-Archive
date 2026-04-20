import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // Centralizando a criação do token para Login e Register
  async generateToken(userId: string | number, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Lógica de validação de Login
  async validateLoginUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    // Compara a senha enviada com o hash salvo no banco (RDS/Prisma)
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

    // Retorna o token gerado (Auto-login pronto)
    return this.generateToken(user.id, user.email);
  }
}
