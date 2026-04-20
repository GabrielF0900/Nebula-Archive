import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
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

  // Lógica de Registro
  async register(username: string, email: string, password: string) {
    // Verifica se o usuário já existe
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });

    // Retorna o token para auto-login
    return this.generateToken(user.id, user.email);
  }

  // Obter perfil do usuário
  async getProfile(userId: string | number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Retorna dados do usuário sem a senha
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
