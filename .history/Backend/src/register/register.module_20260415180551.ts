import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import {JwtModule} from "@nestjs/jwt";

@Module({
  controllers: [RegisterController],
  providers: [RegisterService]

  
}), 
export class RegisterModule {}
