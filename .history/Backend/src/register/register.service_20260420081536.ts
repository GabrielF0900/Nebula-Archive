import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../authservice/dto/create-user.dto';
import { AuthService } from '../authservice/auth.service';

@Injectable()
export class RegisterService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async register(CreateUserDto: CreateUserDto) {
    const { username, email, password } = CreateUserDto;

    //Verificando se o usuario existe.
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('E-mail já cadastrado no Nebula Archive');
    }

    //Criptografando a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    //Criando o usuário no banco de dados
    const userCreated = await this.prismaService.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    //Gerando o token JWT
    const token = await this.authService.generateToken(
      userCreated.id,
      userCreated.email,
    );

    return {
      message: 'Usuário registrado com sucesso',
      token: token,
    };
  }
}
