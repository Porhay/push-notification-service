import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity';

@Entity()
export class PushNotification extends AbstractEntity<PushNotification> {
  @Column()
  userId: string;

  @Column()
  username: string;

  @Column()
  type: string;

  @Column({ default: false })
  sent: boolean;

  @Column({ type: 'timestamp' })
  scheduledTime: Date;
}
