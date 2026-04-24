import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Usado no Registro (Auto-login precisa disso)
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  // Usado no Login para validar as credenciais
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Usado para obter dados do usuário
  async findById(id: string | number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
  }

  // Atualizar username
  async updateUsername(
    id: string | number,
    username: string,
  ): Promise<Omit<User, 'password'>> {
    if (!username || username.length < 3) {
      throw new BadRequestException(
        'Username deve ter pelo menos 3 caracteres',
      );
    }

    // Verifica se username já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== Number(id)) {
      throw new ConflictException('Username já está em uso');
    }

    const user = await this.prisma.user.update({
      where: { id: Number(id) },
      data: { username },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Atualizar senha
  async updatePassword(
    id: string | number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException(
        'Nova senha deve ter pelo menos 6 caracteres',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Verifica se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashedPassword },
    });

    return { message: 'Senha atualizada com sucesso' };
  }

  // Atualizar email
  async updateEmail(
    id: string | number,
    email: string,
  ): Promise<Omit<User, 'password'>> {
    if (!email || email.length === 0) {
      throw new BadRequestException('Email não pode estar vazio');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Email inválido');
    }

    // Verifica se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== Number(id)) {
      throw new ConflictException('Email já está em uso');
    }

    const user = await this.prisma.user.update({
      where: { id: Number(id) },
      data: { email },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Deletar conta
  async deleteAccount(id: string | number): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    await this.prisma.user.delete({
      where: { id: Number(id) },
    });

    return { message: 'Conta deletada com sucesso' };
  }
}
