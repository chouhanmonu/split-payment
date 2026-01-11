import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnvironment } from './utility/env.util';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';

async function bootstrap() {
  console.log(`App running in \x1b[34m${getEnvironment()}\x1b[0m environment`);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true }),
  );

  // tell class-validator to use Nest’s Dependency Injection container
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);
  app.enableCors({
    origin: config.get<string>('WEB_APP_URL'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);

  const appLogger = new Logger('App');
  appLogger.log(`App url: \x1b[34m${await app.getUrl()}\x1b[0m`);
}
bootstrap();
