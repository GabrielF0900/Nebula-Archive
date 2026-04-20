import { Module } from '@nestjs/common';

@Module({
    providers: [],
    exports: [], // Exporte os serviços que precisam ser usados em outros módulos (ex: AuthService)
})
export class UserModule {}
