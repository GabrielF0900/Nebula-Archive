import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from './auth.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    

}
