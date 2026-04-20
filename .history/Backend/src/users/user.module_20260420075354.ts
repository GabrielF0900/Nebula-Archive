// users.module.ts
@Module({
  providers: [UsersService],
  exports: [UsersService], // 👈 ISSO É OBRIGATÓRIO
})
export class UsersModule {}
