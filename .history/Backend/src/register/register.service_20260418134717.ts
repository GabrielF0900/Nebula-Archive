import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterDto } from '../../../.history/Backend/src/register/register.dto_20260415184148';

@Injectable()
export class RegisterService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async register(RegisterDto: RegisterDto) {
    const {username, email, password} = RegisterDto;

    //Verificando se o usuario existe.
    const userExists = await this.
}
