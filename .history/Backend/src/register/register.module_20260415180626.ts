import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
  JwtModule.register({  
  ]


  controllers: [RegisterController],
  providers: [RegisterService]

  
}), 
export class RegisterModule {}
