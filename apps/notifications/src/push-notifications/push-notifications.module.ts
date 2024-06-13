import { Module } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { PushNotificationsController } from './push-notifications.controller';
import { PushNotification } from './entities/push-notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from '../rmq/rmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PushNotification]),
    RmqModule.register({
      name: 'ACCOUNTS',
    }),
  ],
  controllers: [PushNotificationsController],
  providers: [PushNotificationsService],
})
export class PushNotificationsModule {}
