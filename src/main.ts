import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnvironment } from './utility/env.util';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log(`App running in \x1b[34m${getEnvironment()}\x1b[0m environment`);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);

  const appLogger = new Logger('App');
  appLogger.log(`App url: \x1b[34m${await app.getUrl()}\x1b[0m`);
}
bootstrap();
