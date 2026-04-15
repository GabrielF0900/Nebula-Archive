import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/';

@Injectable()
export class RegisterService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async registerUser(username: string, password: string, email: string) {
    //Passando a hash na senha do usuário para o banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);

    //Criando o usuário no banco de dados
    const newUser = await this.prismaService.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });

    //Criando o payload para o token JWT
    const payload = { sub: newUser.id, username: newUser.username };

    //Gerando o token JWT
    const token = this.jwtService.sign(payload);

    //Retornando o token para o cliente
    return { access_token: token };
  }
}
