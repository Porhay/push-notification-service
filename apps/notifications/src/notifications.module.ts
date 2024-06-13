import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RmqModule } from './rmq/rmq.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PushNotificationsModule,
    ScheduleModule.forRoot(),
    RmqModule.register({
      name: 'ACCOUNTS',
    }),
  ],
  controllers: [],
  providers: [],
})
export class NotificationsModule {}
