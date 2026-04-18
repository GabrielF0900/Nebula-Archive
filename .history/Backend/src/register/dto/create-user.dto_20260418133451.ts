//Aqui será a validação do algoritmo de registro.

import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;
}
