import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/isPublic';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unreachable code error
  async handleRequest(
    err: any,
    user: any,
    info: Error,
    context: ExecutionContext,
  ) {
    if (info) {
      if (info instanceof TokenExpiredError) {
        try {
          const authorization = context.switchToHttp().getRequest()
            .headers.authorization;

          if (!authorization) {
            throw new HttpException(
              'Token not provided',
              HttpStatus.BAD_REQUEST,
            );
          }

          return this.authService.refresh_token(authorization.split(' ')[1]);
        } catch (error) {
          throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
        }
      }

      if (info instanceof JsonWebTokenError) {
        throw new HttpException(`${info.message}`, HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(`${info.message}`, HttpStatus.BAD_REQUEST);
    }
  }
}
