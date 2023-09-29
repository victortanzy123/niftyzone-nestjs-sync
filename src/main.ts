import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.enableCors();

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get('NODE_ENV');

  if (nodeEnv) {
    app.enableShutdownHooks(); // If process manager sends a 'shutdown' signal, app will perform clean up tasks before termininating -> minimise risk of data loss/corruption
  }

  await app.listen(8080);
}

bootstrap();
