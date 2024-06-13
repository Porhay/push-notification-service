import { NestFactory } from '@nestjs/core';
import { AccountsModule } from './accounts.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RmqService } from './rmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AccountsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('ACCOUNTS'));
  await app.startAllMicroservices();

  const config = app.get(ConfigService);
  const logger = new Logger('main');

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const port = config.get('ACCOUNTS_PORT');

  const options = new DocumentBuilder()
    .setTitle('Push notifications service')
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
