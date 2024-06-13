import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PushNotificationsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class NotificationsModule {}
