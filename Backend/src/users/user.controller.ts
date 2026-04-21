import {
  Controller,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../authservice/jwt-auth.guard';

interface AuthUser {
  userId: string | number;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('update-username')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateUsername(
    @Req() req: AuthenticatedRequest,
    @Body() body: { username: string },
  ) {
    return this.usersService.updateUsername(req.user.userId, body.username);
  }

  @Put('update-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.usersService.updatePassword(
      req.user.userId,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Put('update-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateEmail(
    @Req() req: AuthenticatedRequest,
    @Body() body: { email: string },
  ) {
    return this.usersService.updateEmail(req.user.userId, body.email);
  }

  @Delete('delete-account')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Req() req: AuthenticatedRequest) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}
