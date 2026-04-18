//Criando logica para criação de tokens para que seja acessivel tanto pelo service do login e register.

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()

export class AuthService {