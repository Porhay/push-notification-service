import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class PushNotificationsService {
  @EventPattern('user_created')
  handleUserCreated(data: Record<string, unknown>): void {
    console.log('Received user_created event:', data);
    // Save in db notifications
  }
}
