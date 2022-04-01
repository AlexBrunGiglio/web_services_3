import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API Web Service')
    .setDescription('Documentation de l\'API du TP de web services.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  app.enableCors({ origin: ['http://localhost:8888'], credentials: true });
  const document = SwaggerModule.createDocument(app, config);
  app.use('/api/docs/swagger.json', (req: any, res: any) => {
    res.send(document);
  });

  SwaggerModule.setup('swagger', app, null, {
    swaggerUrl: `/api/docs/swagger.json`,
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });
  await app.listen(3080);
}
bootstrap();
