import { Module } from '@nestjs/common';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';

@Module({
  imports: [PushNotificationsModule],
  controllers: [],
  providers: [],
})
export class NotificationsModule {}
