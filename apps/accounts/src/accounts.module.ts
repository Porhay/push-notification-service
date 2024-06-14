import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RmqModule } from './rmq/rmq.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RmqModule.register({
      name: 'NOTIFICATIONS',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AccountsModule {}
