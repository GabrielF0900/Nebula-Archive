import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import 

@Module({
  controllers: [RegisterController],
  providers: [RegisterService]
})
export class RegisterModule {}
