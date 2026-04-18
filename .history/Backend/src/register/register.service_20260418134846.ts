import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from "./";

@Injectable()
export class RegisterService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async register(RegisterDto: RegisterDto) {
    const {username, email, password} = RegisterDto;

    //Verificando se o usuario existe.
    const userExists = await this.prismaService.user.findUnique({
      where: {email},
    });

    if (userExists) {
      throw new Error('Usuário já existe');
    }
}
