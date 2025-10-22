import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnvironment } from './utility/env.util';

async function bootstrap() {
  console.log(`App running in \x1b[34m${getEnvironment()}\x1b[0m environment`);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
