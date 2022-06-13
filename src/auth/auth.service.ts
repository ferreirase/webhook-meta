import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserService from '@services/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && (await compare(password, user.password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        refresh_token: user?.refresh_token,
      };
    }
  }

  async login(user: any) {
    const userInfosToReturn = {
      ...user,
    };

    delete userInfosToReturn?.refresh_token;

    const updatedUser = await this.usersService.updateUser(user.email, {
      ...user,
      refresh_token: this.jwtService.sign(
        {
          email: user.email,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    });

    const access_token = this.jwtService.sign(
      {
        email: user.email,
        sub: user._id,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    return {
      user: userInfosToReturn,
      auth: {
        refresh_token: updatedUser?.refresh_token,
        access_token,
      },
    };
  }

  async refresh_token(token: string) {
    try {
      const userDecoded: any = this.jwtService.decode(token);

      if (!userDecoded) {
        throw new HttpException('Token invalid', HttpStatus.BAD_REQUEST);
      }

      const userExists = await this.usersService.findByEmail(userDecoded.email);

      if (!userExists) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      this.jwtService.verify(userExists.refresh_token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      return {
        token: this.jwtService.sign(
          {
            email: userExists.email,
            sub: userExists._id,
          },
          {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
          },
        ),
      };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new HttpException(
          'Refresh token expired',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (err instanceof JsonWebTokenError) {
        throw new HttpException(
          'Refresh token invalid',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}
