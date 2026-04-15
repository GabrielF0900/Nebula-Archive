import { Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}


  @Post()
  async create((@Body) createRegisterDto: CreateRegisterDto) { 
    return this.registerService.create(createRegisterDto);
  }
