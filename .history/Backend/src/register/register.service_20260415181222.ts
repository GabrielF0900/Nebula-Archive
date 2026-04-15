import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class RegisterService {

    constructor(private jwtService: JwtService) {}

     async registerUser(username: string, password: string, email: string) {
        //Passando a hash
        const hashedPassword = await bcrypt.hash(password, 10);
    }
}
