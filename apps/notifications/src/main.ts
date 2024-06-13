import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const config = app.get(ConfigService);
  const logger = new Logger('main');

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const port = config.get('NOTIFICATIONS_PORT');

  const options = new DocumentBuilder()
    .setTitle('Push notifications service')
    .setDescription(
      'This is simple RESTful products API protected with JWT token authentication',
    )
    .addServer(`http://localhost:${port}/`, 'Local environment')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    logger.log(`Server is started on PORT: ${port}`);
  });
}
bootstrap();
