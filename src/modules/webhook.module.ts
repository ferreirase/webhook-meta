import { Module } from '@nestjs/common';
import WebhookController from '@controllers/webhook/webhook.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    /*JwtModule.register({})*/
  ],
  controllers: [WebhookController],
  providers: [],
  exports: [
    /*JwtModule*/
  ],
})
export default class WebhookModule {}
