import { Module } from '@nestjs/common';
import { AuthController } from '@auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtService, JwtModule } from '@nestjs/jwt';
import WebhookModule from '@modules/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      auth: {
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASS,
      },
    }),
    // AuthModule,
    WebhookModule,
  ],
  controllers: [
    /*AuthController*/
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
