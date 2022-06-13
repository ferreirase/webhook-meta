import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';

export async function bootstrap() {
  const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      cert: fs.readFileSync('/home/anderson/cert.pem'),
      key: fs.readFileSync('/home/anderson/key.pem'),
    },
  });

  // const config = new DocumentBuilder()
  //   .setTitle('Journeys Core API')
  //   .setDescription('API de acesso ao backend do Sistema de Jornadas')
  //   .setVersion('1.0')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);

  // SwaggerModule.setup('/', app, document);

  app.use(cookieParser());
  app.use(cors(corsOptions));

  app.listen(process.env.PORT || 3001, () =>
    console.log(`Server is running on port ${process.env.PORT}`),
  );
}
bootstrap();
