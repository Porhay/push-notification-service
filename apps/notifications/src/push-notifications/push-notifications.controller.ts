import { Controller } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '../rmq/rmq.service';

@Controller('push-notifications')
export class PushNotificationsController {
  constructor(
    private readonly pushNotificationsService: PushNotificationsService,
    private readonly rmqService: RmqService,
  ) {}
  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.pushNotificationsService.handleUserCreated(data);
    this.rmqService.ack(context);
  }

  @EventPattern('add_notification')
  async handlePushNotification(@Payload() data: any) {
    await this.pushNotificationsService.handleNotification(data);
  }
}
