import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.registerService.register(createUserDto);
  }
}
