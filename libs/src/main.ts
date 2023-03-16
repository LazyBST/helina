import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { LoggerService } from './logger';
import { LoggingInterceptor } from './interceptors';
import { DataSource } from 'typeorm';
import instrumentation from './instrumentation';

// TODO: create health endpoints
async function bootstrap(
  appModule: any,
  serviceName: string,
): Promise<NestFastifyApplication> {
  instrumentation.start();
  const app = await NestFactory.create<NestFastifyApplication>(
    appModule,
    new FastifyAdapter(),
  );

  const db_conn = app.get(DataSource);
  await db_conn.runMigrations();

  const config = app.get(ConfigService);
  const logger = app.get(LoggerService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: `${serviceName}/v`,
  });

  const port = config.get<number>('PORT');

  if (!port) {
    logger.error('Error getting PORT from env');
    throw new Error('Error getting PORT from env');
  }

  await app.listen(port, '0.0.0.0');

  return app;
}

const service = {
  start: bootstrap,
};

export default service;
