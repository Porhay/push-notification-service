import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { PushNotification } from './entities/push-notification.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);

  constructor(
    @InjectRepository(PushNotification)
    private notificationsRepository: Repository<PushNotification>,
    private readonly configService: ConfigService,
    @Inject('ACCOUNTS') private readonly accountsService: ClientProxy,
  ) {}

  async handleUserCreated(data: Record<string, string>): Promise<void> {
    try {
      this.logger.log('Received user_created event:', data);

      // Save a new notification to the database
      const now = new Date();
      now.setHours(now.getHours() + 24); // current time + 24 hours
      const newNotification = this.notificationsRepository.create({
        type: 'push_notification',
        userId: data.userId,
        username: data.name,
        sent: false,
        scheduledTime: now,
      });
      await this.notificationsRepository.save(newNotification);
      this.logger.log(`Saved new notification, id: ${newNotification.id}`);

      // emit back if required in future
      // this.accountsService.emit('notification_created', {
      //   notificationId: newNotification.id,
      // });
    } catch (error) {
      this.logger.error(`Error handling user_created event: ${error.message}`);
    }
  }

  // TODO: proccess notifications by parts
  @Cron(CronExpression.EVERY_HOUR)
  async processNotifications(): Promise<void> {
    try {
      const notifications = await this.notificationsRepository.find({
        where: {
          sent: false,
          scheduledTime: LessThanOrEqual(new Date()),
        },
      });

      for (const notification of notifications) {
        await this.sendNotification(notification);
        notification.sent = true;
        await this.notificationsRepository.save(notification);
        this.logger.log(`Processed notification, id: ${notification.id}`);
      }
      this.logger.log(`Processed [${notifications.length}] notifications.`);
    } catch (error) {
      this.logger.error(`Error processing notifications: ${error.message}`);
    }
  }

  private async sendNotification(
    notification: PushNotification,
  ): Promise<void> {
    try {
      const webhookUrl = this.configService.get<string>('WEBHOOK_URL');
      const response = await axios.post(webhookUrl, {
        userId: notification.userId,
        message: `Hi, ${notification.username}! Thanks for registration.`,
      });
      this.logger.log(
        `Notification sent to ${webhookUrl}, response: ${response.data}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
    }
  }
}
