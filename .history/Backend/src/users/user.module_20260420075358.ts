// users.module.ts
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
