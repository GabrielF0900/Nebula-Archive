import { Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { register } from 'module';
import { RegisterDto } from './register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}


  @Post()
  async create((@Body) ) { 
    return this.registerService.create(
        registerDto.username,
        registerDto.email,
        registerDto.password
    );
  }
