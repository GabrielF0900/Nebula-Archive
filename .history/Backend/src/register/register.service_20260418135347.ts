import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class RegisterService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
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
      
      username,
      email,
    });
  }
}
