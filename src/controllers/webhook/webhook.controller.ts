import {
  Body,
  Controller,
  Post,
  Get,
  HttpException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '@auth/decorators/isPublic';

@Controller()
export default class WebhookController {
  @Public()
  @Get('/webhooks')
  async validateWebhook(@Req() req: Request): Promise<any | HttpException> {
    console.log('bateu aqui');
    if (!(req?.query['hub.verify_token'] === process.env.META_VERIFY_TOKEN)) {
      throw new HttpException('Verify token invalid', 400);
    }

    return {
      'hub.challenge': req?.query['hub.challenge'],
    };
  }

  @Public()
  @Post('/webhooks')
  async receiveWebhookInformations(
    @Body() body: {},
  ): Promise<{} | HttpException> {
    console.log(body);

    return {
      ok: true,
    };
  }
}
