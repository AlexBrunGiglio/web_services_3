import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Environment } from './environment/environment';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API template')
    .setDescription('API template description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  app.enableCors({ origin: [Environment.app_origin_url], credentials: true });
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
  await app.listen(3088);
}
bootstrap();
