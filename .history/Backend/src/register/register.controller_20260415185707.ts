import { Controller, Post, } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async create(@Body() registerDto: RegisterDto) {
    return this.registerService.registerUser(
      registerDto.username,
      registerDto.password,
      registerDto.email,
    );
  }
}
