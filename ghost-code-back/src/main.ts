import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
  origin: true, // allows all origins safely for APIs
  credentials: true,
});


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();