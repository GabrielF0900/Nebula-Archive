import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async Login(@Body() Body: { email: string; password: string }) {
    return this.authService.validateLoginUser(Body.email, Body.password);
  }
}
