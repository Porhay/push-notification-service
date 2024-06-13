import { Module } from '@nestjs/common';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PushNotificationsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class NotificationsModule {}
