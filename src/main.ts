import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

process.on('unhandledRejection', (reason, promise) => {
  console.log(`Unhandled Rejection at:', ${promise}, 'reason:', ${reason}`);
});

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
