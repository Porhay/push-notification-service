import { Module } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { PushNotificationsController } from './push-notifications.controller';
import { PushNotification } from './entities/push-notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PushNotification])],
  controllers: [PushNotificationsController],
  providers: [PushNotificationsService],
})
export class PushNotificationsModule {}
