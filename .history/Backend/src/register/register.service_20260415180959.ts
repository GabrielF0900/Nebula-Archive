import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class RegisterService {

    constructor(private jwtService: JwtService) {}

    
}
