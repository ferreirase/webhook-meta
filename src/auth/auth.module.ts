// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import UserModule from '@modules/user/user.module';
// import { AuthService } from './auth.service';
// import UserService from '@services/user/user.service';
// import { AuthController } from './auth.controller';
// import { LocalStrategy } from './strategies/local.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { MongooseModule } from '@nestjs/mongoose';
// import User, { UserSchema } from '@models/user';
// import { MongoRepository } from '@repositories/user/user-repository-mongo';

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     UserModule,
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//     PassportModule,
//     JwtModule.register({}),
//   ],
//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     LocalStrategy,
//     JwtStrategy,
//     UserService,
//     MongoRepository,
//   ],
//   exports: [AuthService],
// })
// export class AuthModule {}
