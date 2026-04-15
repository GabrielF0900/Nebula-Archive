import { Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { register } from 'module';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}


  @Post()
  async create((@Body) register(specifier)) { 
    return this.registerService.create(createRegisterDto);
  }
