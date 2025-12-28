import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { ValidationPipe } from '@nestjs/common';
import path from 'path';

const appModulePath = path.join(__dirname, '..', 'dist', 'src', 'app.module.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppModule } = require(appModulePath);

let bootstrapPromise: Promise<Express> | null = null;
let cachedServer: Express | null = null;

async function bootstrap(): Promise<Express> {
  const server = express();
  const adapter = new ExpressAdapter(server);
  const app = await NestFactory.create(AppModule, adapter, {
    logger: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  await app.init();
  return server;
}

export default async function handler(req, res) {
  try {
    if (!cachedServer) {
      if (!bootstrapPromise) {
        bootstrapPromise = bootstrap();
      }
      cachedServer = await bootstrapPromise;
    }

    cachedServer(req, res);
  } catch (err) {
    console.error('Nest bootstrap error:', err);
    res.status(500).send('Internal Server Error');
  }
}
