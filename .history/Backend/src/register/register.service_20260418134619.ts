import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class RegisterService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async;
}
