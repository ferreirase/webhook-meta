import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from '@auth/decorators/isPublic';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: any, @Res() res: Response) {
    const userLogged = await this.authService.login(req.user);

    return res.json(userLogged);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(200)
  async refresh_token(@Body() { token }, @Res() res: Response) {
    const newToken = await this.authService.refresh_token(token);

    return res.json(newToken);
  }
}
